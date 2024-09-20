import React, { useState, useEffect, useRef } from 'react';
import { FaGripLines, FaTrash } from 'react-icons/fa'; 
import Input from './Input';
import { fetchWithAuth } from '../services/apiService';
import toastr from 'toastr';

const DraggableList = ({ convention_id }) => {
    const [items, setItems] = useState([]);
    const [draggedItemId, setDraggedItemId] = useState(null);
    const dropZoneRef = useRef(null);

    useEffect(() => {
        const fetchAgendas = async () => {
            try {
                const response = await fetchWithAuth(`/user/convention_agenda/${convention_id}`);
                if (!response.ok) throw new Error('Failed to fetch agendas');
        
                const data = await response.json();
                if (Array.isArray(data)) {
                    setItems(data);  // Only set if the response is an array
                } else {
                    console.error('Invalid data structure:', data);
                    setItems([]);
                }
            } catch (error) {
                console.error('Error fetching agendas:', error);
                setItems([]);
            }
        };
        
        if (convention_id) {
            fetchAgendas();
        }
    }, [convention_id]);

    const handleCheckboxChange = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const allowDrop = (ev) => {
        ev.preventDefault();
    };

    const drag = (ev, id) => {
        setDraggedItemId(id);
        ev.dataTransfer.setData("text", String(id));  // Store ID as string
    };

    const drop = async (ev) => {
        ev.preventDefault();
        const droppedItemId = ev.dataTransfer.getData("text");
        console.log('Dropped item ID:', droppedItemId);
    
        const draggedItem = items.find(item => item.id === parseInt(droppedItemId, 10));
        if (!draggedItem) {
            console.error('Dragged item not found:', droppedItemId);
            return;
        }
    
        const dropIndex = Array.from(dropZoneRef.current.children).indexOf(ev.target.closest('.draggable'));
    
        const updatedItems = items.filter(item => item.id !== draggedItem.id);
        updatedItems.splice(dropIndex, 0, draggedItem);
    
        // Update priorities based on new order
        const updatedPriorities = updatedItems.map((item, index) => ({
            ...item,
            priority: index + 1,
        }));
    
        setItems(updatedPriorities);
    
        // Update priorities on the server
        try {
            // Make the API call to update the priorities on the backend
            await Promise.all(updatedPriorities.map(async (item) => {
                const response = await fetchWithAuth(`/user/convention_agenda/${item.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        convention_id: item.convention_id,
                        priority: item.priority,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to update priority for item ${item.id}`);
                }
            }));
    
            // Show success toastr once after all updates are done
            toastr.success('Priorities updated successfully');
    
        } catch (error) {
            console.error('Error updating priorities:', error);
            toastr.error('An error occurred while updating priorities.');
        }
    
        setDraggedItemId(null);  // Reset dragged item ID
    };
    

    useEffect(() => {
        const dropZone = dropZoneRef.current;
        if (dropZone) {
            dropZone.addEventListener('drop', drop);
            dropZone.addEventListener('dragover', allowDrop);
        }
        return () => {
            if (dropZone) {
                dropZone.removeEventListener('drop', drop);
                dropZone.removeEventListener('dragover', allowDrop);
            }
        };
    }, [items]);  // Ensure items are included in dependencies for correct drop handling

    return (
        <div className="container">
            <div ref={dropZoneRef} className="dropzone">
                {items.map(item => (
                    <div
                        key={item.id}
                        id={item.id}
                        draggable="true"
                        onDragStart={(e) => drag(e, item.id)}
                        className={`draggable bg-darkBlue p-3 flex justify-between items-center mt-5 ${item.checked ? 'line-through' : ''} ${draggedItemId === item.id ? 'opacity-50' : ''}`}
                    >
                        <div className="flex gap-x-6 items-center">
                            <Input
                                type="checkbox"
                                name={item.id}
                                checked={item.checked}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                            <p className="text-white">{item.agenda_item}</p>
                        </div>
                        {item.checked ? (
                            <FaTrash className="text-[#E78530]" />
                        ) : (
                            <FaGripLines className="text-white" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DraggableList;

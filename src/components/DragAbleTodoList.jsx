import React, { useState, useEffect, useRef } from 'react';
import { FaGripLines, FaTrash } from 'react-icons/fa';
import Input from './Input';
import { fetchWithAuth } from '../services/apiService';
import Button from './Button';
import toastr from 'toastr';

const DraggableList = ({ convention_id }) => {
    const [items, setItems] = useState([]);
    const [draggedItemId, setDraggedItemId] = useState(null);
    const dropZoneRef = useRef(null);
    const [agendaItem, setAgendaItem] = useState('');

    useEffect(() => {
        if (convention_id) {
            fetchAgendas();
        }
    }, [convention_id]);

    const fetchAgendas = async () => {
        try {
            const response = await fetchWithAuth(`/user/convention_agenda/${convention_id}`);
            if (!response.ok) throw new Error('Failed to fetch agendas');

            const data = await response.json();
            if (Array.isArray(data)) {
                setItems(data);
            } else {
                // console.error('Invalid data structure:', data);
                setItems([]);
            }
        } catch (error) {
            // console.error('Error fetching agendas:', error);
            setItems([]);
        }
    };

    const handleCheckboxChange = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetchWithAuth(`/user/convention_agenda/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to delete the agenda item');
            }

            setItems(prevItems => prevItems.filter(item => item.id !== id));
            toastr.success(data.message);
        } catch (error) {
            // console.error('Error deleting agenda item:', error);
            toastr.success(error);
        }
    };

    const allowDrop = (ev) => {
        ev.preventDefault();
    };

    const drag = (ev, id) => {
        setDraggedItemId(id);
        ev.dataTransfer.setData("text", String(id));
    };

    const drop = async (ev) => {
        ev.preventDefault();
        const droppedItemId = ev.dataTransfer.getData("text");
        const draggedItem = items.find(item => item.id === parseInt(droppedItemId, 10));
        if (!draggedItem) return;

        const dropIndex = Array.from(dropZoneRef.current.children).indexOf(ev.target.closest('.draggable'));
        const updatedItems = items.filter(item => item.id !== draggedItem.id);
        updatedItems.splice(dropIndex, 0, draggedItem);

        const updatedPriorities = updatedItems.map((item, index) => ({
            ...item,
            priority: index + 1,
        }));

        setItems(updatedPriorities);

        try {
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

            toastr.success('Priorities updated successfully');
        } catch (error) {
            // console.error('Error updating priorities:', error);
            toastr.error('An error occurred while updating priorities.');
        }

        setDraggedItemId(null);
    };

    // Mobile touch event handlers
    const handleTouchStart = (e, id) => {
        const touch = e.touches[0];
        setDraggedItemId(id);
        e.currentTarget.style.opacity = 0.5; // Visual feedback for dragging
        e.dataTransfer.setData("text", String(id));
    };

    const handleTouchMove = (e) => {
        // This can be refined to implement more complex touch move behavior
        e.preventDefault(); // Prevent default behavior during touch move
    };

    const handleTouchEnd = async (e) => {
        const droppedItemId = draggedItemId;
        const draggedItem = items.find(item => item.id === droppedItemId);
        if (!draggedItem) return;

        const dropIndex = Array.from(dropZoneRef.current.children).indexOf(e.target.closest('.draggable'));
        const updatedItems = items.filter(item => item.id !== draggedItem.id);
        updatedItems.splice(dropIndex, 0, draggedItem);

        const updatedPriorities = updatedItems.map((item, index) => ({
            ...item,
            priority: index + 1,
        }));

        setItems(updatedPriorities);

        try {
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

            toastr.success('Priorities updated successfully');
        } catch (error) {
            // console.error('Error updating priorities:', error);
            toastr.error('An error occurred while updating priorities.');
        }

        setDraggedItemId(null);
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
    }, [items]);

    const handleInputChange = (e) => {
        setAgendaItem(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetchWithAuth(`/user/convention_agenda`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    convention_id,
                    agenda_description: agendaItem
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toastr.success(data.message);
                fetchAgendas(convention_id);
                setAgendaItem('');
            } else {
                toastr.error('Failed to save the agenda');
            }
        } catch (error) {
            // console.error('Error submitting form:', error);
            toastr.error('An error occurred while saving the agenda');
        }
    };

    return (
        <div className="container">
            <div ref={dropZoneRef} className="dropzone">
                {items.map(item => (
                    <div
                        key={item.id}
                        id={item.id}
                        draggable="true"
                        onDragStart={(e) => drag(e, item.id)}
                        onTouchStart={(e) => handleTouchStart(e, item.id)}  // Add touch event for mobile
                        onTouchMove={handleTouchMove}  // Add touch move event for mobile
                        onTouchEnd={handleTouchEnd}  // Add touch end event for mobile
                        className={`draggable bg-darkBlue p-3 flex justify-between items-center mt-5 ${item.checked ? 'line-through' : ''} ${draggedItemId === item.id ? 'opacity-50' : ''}`}
                    >
                        <div className="flex gap-x-6 items-center">
                            <Input
                                type="checkbox"
                                name={item.id}
                                checked={item.checked}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                            <p className="text-white">{item.agenda_description}</p>
                        </div>
                        {item.checked ? (
                            <FaTrash
                                className="text-[#E78530] cursor-pointer"
                                onClick={() => handleDelete(item.id)}
                            />
                        ) : (
                            <FaGripLines className="text-white" />
                        )}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <Input
                    name={"agenda_description"}
                    placeholder={"Type here to add a new agenda item"}
                    type={"text"}
                    className={`w-[100%] h-[2.3rem] rounded-md text-white px-4 mt-4 outline-none bg-darkBlue`}
                    value={agendaItem}
                    onChange={handleInputChange}
                />
                <div className='mt-4 flex justify-end'>
                <Button
                        title={"Save Item"}
                        className={`w-[9rem] h-[2.3rem] rounded-md text-white bg-lightOrange`}
                        type="submit"  // Set button type to submit
                    />
                </div>
            </form>
        </div>
    );
};

export default DraggableList;

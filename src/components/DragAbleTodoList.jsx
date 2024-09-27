import React, { useState, useEffect, useRef } from 'react';
import { FaGripLines, FaTrash } from 'react-icons/fa';
import Input from './Input';
import { fetchWithAuth } from '../services/apiService';
import Button from './Button'

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

            // Update the local state to remove the deleted item
            setItems(prevItems => prevItems.filter(item => item.id !== id));
            toastr.success(data.message);

        } catch (error) {
            console.error('Error deleting agenda item:', error);
        }
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
        // console.log('Dropped item ID:', droppedItemId);

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

    const handleInputChange = (e) => {
        setAgendaItem(e.target.value);  // Update agenda item input state
    };
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission

        try {
            // Make POST request to submit agenda item and convention_id
            const response = await fetchWithAuth(`/user/convention_agenda`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    convention_id,  // Sending convention_id
                    agenda_description: agendaItem  // Sending agenda_item from input state
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toastr.success(data.message);
                fetchAgendas(convention_id);
                setAgendaItem('');  // Reset agenda input after submission
                // nav(`/next/agenda/${convention_id}`);
            } else {
                toastr.error('Failed to save the agenda');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
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
                                onClick={() => handleDelete(item.id)} // Trigger delete on click
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
                    value={agendaItem}  // Bind input value to agendaItem state
                    onChange={handleInputChange}  // Handle input change
                />
                <div className='flex justify-between items-center mt-4'>
                    <div className='flex items-center gap-x-4'>
                        {/* <BsPrinterFill className='text-white text-lg cursor-pointer' />
                            <BiSolidDownload className='text-white text-lg cursor-pointer' /> */}
                    </div>
                    <Button
                        title={"Create Agenda"}
                        className={`w-[9rem] h-[2.3rem] rounded-md text-white bg-lightOrange`}
                        type="submit"  // Set button type to submit
                    />
                </div>
            </form>
        </div>

    );
};

export default DraggableList;

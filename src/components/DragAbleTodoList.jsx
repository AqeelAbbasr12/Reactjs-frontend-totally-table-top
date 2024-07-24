import React, { useState, useEffect } from 'react';
import { FaGripLines, FaTrash } from 'react-icons/fa'; // Import FaTrash
import Input from './Input';

const DraggableList = () => {
    const [items, setItems] = useState([
        { id: 'drag2', text: 'See stall A - 34', checked: false },
        { id: 'drag3', text: 'Grab a board game', checked: false },
        { id: 'drag4', text: 'See a fancy pineapple', checked: false },
        { id: 'drag5', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', checked: false }
    ]);

    const handleCheckboxChange = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    useEffect(() => {
        const allowDrop = (ev) => {
            ev.preventDefault();
        };

        const drag = (ev) => {
            ev.dataTransfer.setData("text", ev.target.id);
        };

        const drop = (ev) => {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            const draggableElement = document.getElementById(data);
            const dropzone = ev.target;

            if (dropzone.classList.contains('dropzone')) {
                dropzone.appendChild(draggableElement);
            }
        };

        document.querySelectorAll('.draggable').forEach(item => {
            item.addEventListener('dragstart', drag);
        });

        const dropZones = document.querySelectorAll('.dropzone');
        dropZones.forEach(dropZone => {
            dropZone.addEventListener('drop', drop);
            dropZone.addEventListener('dragover', allowDrop);
        });

        return () => {
            document.querySelectorAll('.draggable').forEach(item => {
                item.removeEventListener('dragstart', drag);
            });

            dropZones.forEach(dropZone => {
                dropZone.removeEventListener('drop', drop);
                dropZone.removeEventListener('dragover', allowDrop);
            });
        };
    }, []);

    return (
        <div className='container'>
            <div className='dropzone'>
                {items.map(item => (
                    <div
                        key={item.id}
                        id={item.id}
                        draggable="true"
                        className={`draggable bg-darkBlue p-3 flex justify-between items-center mt-5 ${item.checked ? 'line-through' : ''}`}
                    >
                        <div className='flex gap-x-6 items-center'>
                            <Input
                                type={"checkbox"}
                                name={item.id}
                                checked={item.checked}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                            <p className='text-white'>{item.text}</p>
                        </div>
                        {item.checked ? (
                            <FaTrash className='text-[#E78530]' />
                        ) : (
                            <FaGripLines className='text-white' />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DraggableList;

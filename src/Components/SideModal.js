import React from 'react';
import Modal from '@mui/material/Modal';
import Both from '../assets/both-removebg-preview.png';

export default function SideModal({ open, handleClose, setSide, side }) {

    const HandleSide = (s) => {
        setSide(s);  // Update the side in GameDashboard
        handleClose();  // Close the modal after selection
    };

    return (
        <div className='items-center justify-center flex'>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='items-center justify-center flex'>
                    <div className='absolute top-40 flex shadow-2xl p-4 bg-[#021826]'>
                        <div>
                            <img src={Both} alt='Coin sides' />
                            <div className='items-center flex justify-around'>
                                <button style={{ background: side == 'Head' ? 'green' : '#0079FD' }}
                                    className='text-white text-xl font-bold rounded-xl p-3'
                                    onClick={() => HandleSide('Head')}
                                >
                                    Head
                                </button>
                                <button style={{ background: side == 'Tail' ? 'green' : '#0079FD' }}
                                    className='text-white text-xl font-bold rounded-xl p-3'
                                    onClick={() => HandleSide('Tail')}
                                >
                                    Tail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

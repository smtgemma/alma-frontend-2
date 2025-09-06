import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (typeof window === "undefined") return null; // Prevents SSR issues

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: "100%", // Mobile: Start from bottom
                            scale: window.innerWidth >= 768 ? 0.75 : 1, // Tablet+: Scale down
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: window.innerWidth < 768 ? "100%" : 20, // Mobile: Slide down
                            scale: window.innerWidth >= 768 ? 0.75 : 1, // Tablet+: Scale down
                        }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="fixed inset-0 z-50 flex justify-end md:justify-center items-end md:items-center h-[80vh] mt-auto md:h-full"
                    >
                        {/* Click Outside Close Area */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-transparent z-20"
                        />

                        {/* Modal Content */}
                        <div className="bg-white h-full md:h-auto md:rounded-xl shadow-xl z-30 overflow-hidden relative">
                            {/* Close Button */}
                            <div className="absolute z-40 top-2 left-2 cursor-pointer">
                                <LuX onClick={onClose} className="" />
                            </div>

                            {/* Modal Body */}
                            <div className="p-4 flex flex-col h-full md:h-auto relative">
                                <div className="flex-grow overflow-y-auto">{children}</div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body // Ensure modal is at the top level
    );
};
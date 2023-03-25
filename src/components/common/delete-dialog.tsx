import useDialog from "~/hooks/useDialog";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface IDeleteDialog {
   onDelete: () => void;
   title: string;
   message: string;
}

const DeleteDialog: React.FC<IDeleteDialog> = ({ onDelete, title, message }) => {
   const { isOpen, openDialog, closeDialog } = useDialog();

   return (
      <div>
         <li><a onClick={openDialog}>Delete</a></li>
         <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeDialog}>
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
               </Transition.Child>

               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                     <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                        <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                           <Dialog.Title
                              as="h3"
                              className="text-lg font-medium leading-6 text-gray-900 py-2"
                           >
                              {title}
                           </Dialog.Title>
                           <p className="text-gray-500">{message}</p>
                           <div className="flex justify-end mt-4">
                              <button
                                 className="btn btn-primary"
                                 type="button"
                                 onClick={onDelete}
                              >
                                 Delete
                              </button>
                           </div>
                        </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </div>
   );
};

export default DeleteDialog;
import { type FieldError } from "react-hook-form";
import { RxQuestionMarkCircled } from "react-icons/rx";

interface ICustomFormControl {
   label: string;
   tooltip?: string;
   error?: FieldError;
   children: React.ReactNode;
   setMaxWidth?: boolean;
}

const CustomFormControl: React.FC<ICustomFormControl> = ({ label, error, tooltip, children, setMaxWidth }) => {
   return (
      <div className={`form-control w-full ${setMaxWidth ? 'max-w-xs' : ''}`}>
         <label className="label py-1">
            <span className="label-text text-[#8A8BB3]">{label}</span>
            {tooltip && (
               <div className="tooltip" data-tip={tooltip}>
                  <RxQuestionMarkCircled className="text-[#8A8BB3] text-sm" />
               </div>
            )}
         </label >
         {children}
         {error && <label className="label">
            <span className="label-text-alt text-error">{error.message}</span>
         </label>}
      </div >
   );
};
export default CustomFormControl;
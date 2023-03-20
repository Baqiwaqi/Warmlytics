import { RxQuestionMarkCircled } from "react-icons/rx";
interface ICustomFormControl {
   label: string;
   tooltip?: string;
   children: React.ReactNode;
}

const CustomFormControl: React.FC<ICustomFormControl> = ({ label, tooltip, children }) => {
   return (
      <div className="form-control w-full max-w-xs">
         <label className="label py-1">
            <span className="label-text text-[#8A8BB3]">{label}</span>
            {tooltip && (
               <div className="tooltip" data-tip={tooltip}>
                  <RxQuestionMarkCircled className="text-[#8A8BB3] text-sm" />
               </div>
            )}
         </label >
         {children}
      </div >
   );
};
export default CustomFormControl;
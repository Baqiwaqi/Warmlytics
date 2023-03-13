
interface ICustomFormControl {
   label: string;
   children: React.ReactNode;
}

const CustomFormControl: React.FC<ICustomFormControl> = ({ label, children }) => {
   return (
      <div className="form-control w-full max-w-xs">
         <label className="label py-1">
            <span className="label-text text-[#8A8BB3]">{label}</span>
         </label>
         {children}
      </div>
   );
};
export default CustomFormControl;
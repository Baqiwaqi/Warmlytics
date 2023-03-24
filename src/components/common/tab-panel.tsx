interface ITabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}

const TabPanel: React.FC<ITabPanelProps> = ({ children, value, index }) => {

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
      >
         {value === index && (
            <div className='p-4'>
               {children}
            </div>
         )}
      </div>
   );
}

export default TabPanel;
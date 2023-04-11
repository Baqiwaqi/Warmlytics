import { RxDashboard, } from "react-icons/rx";
import { TbSunset } from "react-icons/tb";
import { RiHome8Line } from "react-icons/ri";

interface LinksProps {
   icon: React.ReactNode;
   label: string;
   href: string;
   subject?: string;
}

const drawerLinks: LinksProps[] = [
   {
      icon: <RiHome8Line />,
      label: "Isolatie Calculator",
      href: "/",
   },
   {
      icon: <TbSunset />,
      label: "Zonnepaneel Calculator",
      href: "/zonnepanelen",
   },
];

export default drawerLinks;
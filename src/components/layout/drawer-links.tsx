import { RxDashboard, } from "react-icons/rx";
import { MdOutlineSettings } from "react-icons/md";

interface LinksProps {
   icon: React.ReactNode;
   label: string;
   href: string;
   subject?: string;
}

const drawerLinks: LinksProps[] = [
   {
      icon: <RxDashboard />,
      label: "Dashboard",
      href: "/",
   },
   // {
   //    icon: <MdOutlineSettings />,
   //    label: "Settings",
   //    href: "/settings",
   // },
];

export default drawerLinks;
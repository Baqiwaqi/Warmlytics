import { RxDashboard, } from "react-icons/rx";

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

];

export default drawerLinks;
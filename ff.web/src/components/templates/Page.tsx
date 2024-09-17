import { motion } from 'framer-motion';

interface PageProps {
  children?: React.ReactNode;
  containerClass?: string;
  className?: string;
}

// function Container(props: PageProps) {
//   const { children, containerClass, className } = props;

//   if (!containerClass) {
//     return <div>{children}</div>;
//   }

//   return (
//     <div className={`page-container ${containerClass} ${className}`}>
//       {children}
//     </div>
//   );
// }

// function Page(props: PageProps) {
//   const { children, containerClass, className = "" } = props;

//   const childs = containerClass ? Container(props) : children;

//   return <div className={`page ${className}`}>{childs}</div>;
// }

// export default Page;

export default function Page({children}: PageProps) { // TODO rename it to my version
  return (
    <motion.div 
      style={{border: "1px solid cyan", display: "flex", flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem"}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  ) 
}

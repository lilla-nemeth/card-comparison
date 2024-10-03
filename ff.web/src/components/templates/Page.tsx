import { motion } from "framer-motion";
import module from "@vuo/scss/components/templates/Page.module.scss";
import { PageProps } from "@vuo/types/pageProps";

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

export default function Page({ children }: PageProps) {
  // TODO rename it to my version
  return (
    <motion.div
      className={module.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

interface PageProps {
  children?: React.ReactNode;
  containerClass?: string;
  className?: string;
}

function Container(props: PageProps) {
  const { children, containerClass, className } = props;

  if (!containerClass) {
    return <div>{children}</div>;
  }

  return (
    <div className={`page-container ${containerClass} ${className}`}>
      {children}
    </div>
  );
}

function Page(props: PageProps) {
  const { children, containerClass, className = "" } = props;

  const childs = containerClass ? Container(props) : children;

  return <div className={`page ${className}`}>{childs}</div>;
}

export default Page;

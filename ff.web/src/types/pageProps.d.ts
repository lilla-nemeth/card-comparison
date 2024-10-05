// for template
interface PageProps {
  children?: React.ReactNode;
  containerClass?: string;
  className?: string;
}

interface Meal {
  id: string;
  title: string;
  elo: number;
  image: string;
  name?: string;
};

export type { PageProps, Meal };

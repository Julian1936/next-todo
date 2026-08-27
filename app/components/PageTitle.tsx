interface TitleProps {
  title: string;
  subTitle?: string;
}

export default function PageTitle({ title, subTitle }: TitleProps) {
  return (
    <>
      <div className="page-header mb-5">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {subTitle && <p>{subTitle}</p>}
      </div>
    </>
  );
}

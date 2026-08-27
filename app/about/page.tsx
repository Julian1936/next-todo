import PageTitle from "../components/PageTitle";

export default function AboutPage() {
  return (
    <>
      <PageTitle title="About Next JS Todos" subTitle="This is part of a techincal take home challenge for a Front-end Developer role" />
      <p className="mb-4">Below is the outline that I was given:</p>
      <ol className="list-decimal list-inside">
        <li>Create User Authentication and their own TODOs</li>
        <li>Make Responsive view</li>
        <li>View all TODO in Calendar</li>
        <li>User can View, ADD, Update and Delete their TODO</li>
        <li>Use any Headless CMS (Recommended HyGraph)</li>
        <li>Technologies: NEXTJS and Nodejs version 16.x</li>
      </ol>
    </>
  );
}

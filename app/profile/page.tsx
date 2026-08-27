import PageTitle from "../components/PageTitle";
import ProfileForm from "../components/ProfileForm";

export default function ProfilePage() {
  return (
    <>
      <PageTitle title="User Profile Page" subTitle="Here you can update your first and last name" />
      <ProfileForm />
    </>
  );
}

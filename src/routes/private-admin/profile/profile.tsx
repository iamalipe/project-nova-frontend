import ProfileContent from "./profile-content";
import ProfileHeader from "./profile-header";

const Profile = () => {
  return (
    <main className="flex-1 overflow-auto flex flex-col p-2 md:p-4 gap-2 md:gap-4">
      <ProfileHeader />
      <ProfileContent />
    </main>
  );
};

export default Profile;

import type { User } from "@/features/user/types/user.type";

function UserMenuComponent({ user }: { user: User }) {
  return (
    <section>
      <div>
        <img src={user.avatarUrl} alt={user.username} width={32} height={32} />
      </div>
      <div>
        <h1>{user.username}</h1>
        <p>{user.email}</p>
      </div>
    </section>
  );
}
export default UserMenuComponent;

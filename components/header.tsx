import { Logout } from "./logout";
import { OrganizationSwitcher } from "./organization-switcher";
import { getOrganizations } from "@/server/organizations";

export async function Header() {
  const organizations = await getOrganizations();

  return (
    <header className="absolute top-0 right-0 flex justify-between items-center p-2 md:p-4 w-full z-40">
      <div className="flex-1 max-w-[200px] md:max-w-xs">
        <OrganizationSwitcher organizations={organizations} />
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <Logout />
      </div>
    </header>
  );
}

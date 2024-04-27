import { Link } from "react-router-dom";

export default function OrganizationCard({
  description,
  id,
  profile_link,
  name,
  project_association,
  contact_name,
  contact_detail,
  funds_received,
  funds_required
}) {
  return (
    <>
      <div class="flex justify-between gap-x-6 py-5 font-opensans mb-13">

        <div class="flex w-4/5 sm:w-3/4">
          <div class="min-w-0 flex-auto">
            <Link to={profile_link} class="text-lg font-semibold leading-6 text-gray-900 hover:">{name}</Link>

            <p class="text-sm leading-6 text-gray-900">{project_association}</p>
            <p class="mt-1 line-clamp-3 text-sm leading-5 text-gray-500">{description}</p>
            {(funds_required > 0) && 
              <div className=" p-2 my-1 rounded-lg shadow-md  transition-colors duration-300 ease-in-out">
                  <div className="flex flex-col  h-full">
                      <div class="flex justify-between mb-1">
                        <span class="text-base font-medium text-customGreen-700 ">Progress</span>
                        <span class="text-sm font-medium text-customGreen-700 dark:text-white">{(funds_received / funds_required) * 100}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-customGreen-600 h-2.5 rounded-full" style={{ width: `${Math.min(Math.max((funds_received / funds_required) * 100, 0), 100)}%` }}></div>
                      </div>
                  </div>
                </div>
            }
          </div>
        </div>
        {/* block2 */}
        <div class="flex-1 content-evenly">
          <p class="text-sm leading-6 text-gray-900 mb-2">{contact_name}</p>
          <p class="mt-1 text-xs leading-5 text-gray-500 mb-4"><a href="mailto:{contact_detail}">{contact_detail}</a></p>
          {(funds_required > 0) && 
            <button class="transition ease-in-out delay-100 p-1 px-2 rounded-md shadow-md text-gray-700 bg-customGreen-300 hover:-translate-y-1 hover:scale-110 hover:bg-customGreen-500 hover:text-white duration-300 ...">
              Fund
            </button>
          }
        </div>
      </div>


  </>
  );
}

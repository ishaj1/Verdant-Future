import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function OrganizationCard({
  description,
  id,
  profile_link,
  name,
  project_association,
  contact_name,
  contact_detail,
  funds_received,
  funds_required,
  isProject
}) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const initiateTransaction = (e) => {
    e.preventDefault();
    navigate("/transaction", {
      state: {
        sendToUser: name,
        isTrade: !isProject,
      },
    });
  };


  return (
    <>
      <div className="m-4">
      <div class="flex justify-between gap-x-6 py-5 font-opensans mb-13 transition ease-in-out delay-50 p-1 px-4 rounded-md shadow-md text-gray-700 bg-white hover:-translate-y-1 hover:scale-105 hover:bg-white hover:text-white duration-300 ...">

        <div class="flex w-4/5 sm:w-3/4">
          <div class="min-w-0 flex-auto">
          <div class="text-lg font-semibold leading-6 text-gray-900 hover:">{name}</div>

            <p class="text-sm leading-6 text-gray-900">{project_association}</p>
            <p class="mt-1 text-sm leading-5 text-gray-500">{description}</p>
            {(funds_required > 0) && 
              <div className="p-2 my-1 rounded-lg ">
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
        <div class="flex-1 content-evenly">
          <p class="text-sm leading-6 text-gray-900 mb-2">{contact_name}</p>
          <p class="mt-1 text-xs leading-5 text-customGreen-600 mb-4 hover:text-customGreen-800"><a href={`mailto:${contact_detail}`}>{contact_detail}</a></p>
          {!auth.isProject && auth.username !== name && (funds_required > 0) && (
            <button class="transition ease-in-out delay-50 p-1 px-2 rounded-md shadow-md text-gray-700 bg-customGreen-300 hover:-translate-y-1 hover:scale-110 hover:bg-customGreen-500 hover:text-white duration-200 ..."
              onClick={initiateTransaction}
            >
              {isProject ? "Invest" : "Trade"}
            </button>
           )
          }
        </div>
      </div>
    </div>

  </>
  );
}

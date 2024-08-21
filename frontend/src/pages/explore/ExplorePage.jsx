import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import {useQuery }from "@tanstack/react-query"

import RightPanelSkeleton from "../../components/skeletons/RightPanelSkeleton"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import useFollow from "../../hooks/useFollow"
const ExplorePage = () => {
  const {follow, isPending} = useFollow()
	const {data:suggestedUsers, isLoading} = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const response = await fetch("/api/user/suggest", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				const data = await response.json();
				if (!response.ok) {
					throw new Error(data.message || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	})

	if(suggestedUsers?.length === 0){
		return <div className="md:w-64 w-0"></div>
	}

  return (
    <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
      <div className="flex justify-center items-center pt-4">
        <label className="input border border-gray-700 flex justify-between items-center w-full rounded-full m-4">
          <input
            type="text"
            placeholder="Search"
          />
          <IoIosSearch className="w-5 h-5 text-gray-400" />
        </label>
      </div>
      <div className="mx-4">
				<p className='font-bold flex justify-start mb-2'>Suggested Users</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold'>
											{user.fullname}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) =>{ 
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size="sm" /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
    </div>   
  )
}

export default ExplorePage
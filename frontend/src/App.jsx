import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import SideBar from './components/common/Sidebar'
import './App.css'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import toast, { Toaster } from 'react-hot-toast'
import {useQuery} from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'
function App() {
	const {data:authUser, isLoading} = useQuery({
		queryKey: ['authUser'],
		queryFn: async() => {
			try {
				const response = await fetch('/api/auth/me');
				const data = await response.json();
				if(data.error) return null;
				if(!response.ok) throw new Error(data.error || 'Something went wrong');
				console.log(data);
				return data;
			} catch (error) {
				console.log(error);
				throw new Error(error);
			}
		},
		retry: false,
	});
	if(isLoading) {
		return (
		<div className='flex justify-center items-center h-screen'>
			<LoadingSpinner size='lg'/>
		</div>
		);
	};
  return (
    <div className='flex max-w-6xl mx-auto'>
		{authUser && <SideBar/>}
		<Routes>
			<Route path='/' element={authUser? <HomePage/> : <Navigate to='/login'/> }/>
			<Route path='/signup' element={!authUser? <SignUpPage />: <Navigate to='/'/>} />
			<Route path='/login' element={!authUser? <LoginPage />: <Navigate to='/'/> } />
			<Route path='/notifications' element={authUser? <NotificationPage/> : <Navigate to='/login'/>} />
			<Route path='/profile/:username' element={authUser? <ProfilePage/> : <Navigate to='/login'/>} />
			<Route path='*' element={<h1>Not Found</h1>} />
		</Routes>
		{authUser && <RightPanel/>}
		<Toaster/>
	</div>
  )
}

export default App

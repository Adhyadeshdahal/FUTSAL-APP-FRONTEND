
import React, { useEffect, useRef, useState } from 'react';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import "primereact/resources/themes/bootstrap4-light-purple/theme.css";

export default function User({logOut}) {
    const [usr,setUsr]=useState();
    const [imgUrl,setImgUrl] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:1000/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': localStorage.getItem('authToken')
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUsr(data);
                
                // Handle the user data here
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const fetchAvatar = async () => {
            if (usr && usr.user && usr.user._id) {
                const userId = usr.user._id;
    
                try {
                    const response = await fetch(`http://localhost:1000/me/avatar/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'image/jpeg',
                            'x-auth-token': localStorage.getItem('authToken')
                        }
                    });
    
                    if (!response.ok) {
                        throw new Error('Failed to fetch avatar');
                    }
    
                    const blob = await response.blob(); // Convert the response to a Blob
                    const imageUrl = URL.createObjectURL(blob);
                    setImgUrl(imageUrl);
    
                    console.log('Avatar URL:', imageUrl);
                } catch (error) {
                    console.error('Error fetching avatar:', error);
                }
            }
        };
    
        fetchAvatar();
        console.log(imgUrl);
    }, [usr]);
    
    
    
    return (
        <Splitter style={{ height: '500px'}}>
            <SplitterPanel className="flex flex-col items-center justify-center" size={30} minSize={30}>
                <MyComponent logOut={logOut}  imgUrl={imgUrl}/>
            </SplitterPanel>
            <SplitterPanel className="flex flex-col items-center justify-center" size={70} minSize={70}>
                <My user={usr}/>
            </SplitterPanel>
        </Splitter>
    )
}

function MyComponent({logOut,imgUrl}) {
    const imageStyles = {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        margin: '0 auto 20px',
    };
  
    return (
        <div>
            <div style={imageStyles}>
                <img
                    src={imgUrl}
                    className="w-32 rounded-full"
                    alt="Avatar"
                />
            </div>
            <button className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-danger-50/50 hover:text-danger-600 focus:border-danger-600 focus:bg-danger-50/50 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 motion-reduce:transition-none dark:hover:bg-rose-950 dark:focus:bg-rose-950" data-twe-ripple-init onClick={logOut}>
                LogOut
            </button>
        </div>
    );
}

function My({user}) {
    
  return (
      <>
         {user&& <div className="flex flex-col space-y-8">
          <div className="flex flex-row space-x-16">
          <div className="flex item-center">
                  <label htmlFor="name" className="text-sm font-semibold w-20">Name</label>
                  <input
                      id="name"
                      type="text"
                      className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                      style={{textTransform:"capitalize"}}
                      value={user.user.name}
                      readOnly
                  />
              </div>
          </div>
          
              <div className="flex items-center">
                  <label htmlFor="email" className="text-sm font-semibold w-20">Email</label>
                  <input
                      id="email"
                      type="email"
                      className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                      value={user.user.email}
                      readOnly
                  />
              </div>
              <div className="flex items-center">
                  <label htmlFor="phone" className="text-sm font-semibold w-20">Phone</label>
                  <input
                      id="phone"
                      type="phone"
                      className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                      value="9876543210"
                      readOnly
                  />
              </div>
              <div className="flex items-center">
                  <label htmlFor="email" className="text-sm font-semibold w-20">Address</label>
                  <input
                      id="Address"
                      type="address"
                      className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                      value="Pokhara"
                      readOnly
                  />
              </div>
          </div>}
          <NoOpBox/>
      </>
  );
}


function NoOpBox(){
    return(
        <div style={{height:"15vh",width:"100%"}}></div>
    )
};

const ReadOnlyField = ({ label, value }) => (
    <div className="flex w-full">
        <div className="w-1/2">
            <label className="text-sm font-semibold">{label}</label>
            <input
                type="text"
                className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                value={value}
                readOnly
            />
        </div>
    </div>
);




        
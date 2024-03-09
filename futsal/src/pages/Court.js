import { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { Calendar } from 'primereact/calendar';
import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ChevronDownIcon } from 'primereact/icons/chevrondown';
import { ChevronRightIcon } from 'primereact/icons/chevronright';
import { Rating } from "primereact/rating";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import imageMap from "./image.js";
import "primereact/resources/themes/bootstrap4-light-purple/theme.css";
import './Court.css';

// function MyComponent() {
//   const navigate = useNavigate();
//   navigate('/bookings');
  
// }



export default function Court() {
    const [futsalData, setFutsalData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchFutsalData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/futsals/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log(data.image_url);
                setFutsalData({
                    id: data.id,
                    name: data.name,
                    location: data.location,
                    phoneNumber: data.phone_number,
                    rating:5,
                    price: data.price,
                    imageUrl: data.image_url,
                    dates: data.dates
                });
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };
    
        fetchFutsalData();
    }, [id]);

    return (
        <>
            {futsalData && (
                <>
                    <BookingSection
                        name={futsalData.name}
                        location={futsalData.location}
                        phoneNumber={futsalData.phoneNumber}
                        imageUrl={futsalData.imageUrl}
                        rating={futsalData.rating}
                        price={futsalData.price}
                        dates={futsalData.dates}
                        futsalId={futsalData.id}
                    />
                </>
            )}
        </>
    );
}


function Gallery({ images }) {
    console.log("Images state:", images);

    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    const itemTemplate = (item) => {
        item='https://drive.google.com/file/d/1Giyz1XNlM3o3KlLal-vXBy4ZCH3jupby/view?usp=drive_link';
        return <img src={item} alt="Futsal" style={{ width: '100%' }} />
    };

    return (
        <div className="border-none">
            {/* <img src="./02.jpg" alt="Futsal" style={{ width: '100%' }} /> */}
            <Galleria value={images} style={{ maxWidth: '640px' }} showThumbnails={false} showIndicators item={itemTemplate} />
        </div>
    );
}



const BookingSection = ({ images, value, price, dates, futsalId, name, location, phoneNumber, imageUrl, rating }) => {
    return (
        <>
            <div className="booking-section">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-8">
                            <CourtInfo
                                name={name}
                                location={location}
                                phoneNumber={phoneNumber}
                                imageUrl={imageUrl}
                                rating={rating}
                            />
                        </div>
                        <div className="col bg">
                            <Pricing price={price} dates={dates} futsalId={futsalId} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


const CourtInfo = ({ name, location, phoneNumber, imageUrl, rating }) => {
    return (
        <>
            <div className="center">
                <img src={imageUrl} alt="Futsal" />
            </div>
            <div className="container">
                <div className="block">
                    <span className="label">Name:</span> {name}
                </div>
                <div className="block">
                    <span className="label">Location:</span> {location}
                </div>
                <div className="block">
                    <span className="label">Phone Number:</span> {phoneNumber}
                </div>
                <div className="block">
                    <span className="label">Rating:</span> <Rating value={rating} readOnly cancel={false} />
                </div>
            </div>
        </>
    );
};



const Pricing = ({ price, dates,futsalId }) => {
    const today = new Date();
    const [date, setDate] = useState(today);
    const [dropdown, setDropdown] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    const onCalendarClick = (e) => {
        setDate(e.value);
    };
    useEffect(()=>{
        console.log(date);
    },[date]);

    const fetchTimings = async () => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            console.log(`http://127.0.0.1:5000/futsals/Timings/${futsalId}/${formattedDate}`);// Format date as 'YYYY-MM-DD'
            const response = await fetch(`http://127.0.0.1:5000/futsals/Timings/${futsalId}/${formattedDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch timings');
            }
            const data = await response.json();
            console.log(data);
            setDropdown(data.availableTimings || []);
        } catch (error) {
            console.error('Error fetching timings:', error.message);
        }
    };

    useEffect(() => {
        fetchTimings();
    }, [date]);

    useEffect(() => {
        console.log(dropdown);
        setSelectedTime(dropdown[0]);
    }, [dropdown]);

    const bookNow = async () => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Authentication token not found');
            return;
        }
    
        const bookingData = {
            futsalId: futsalId,
            date: date.toISOString().split('T')[0],
            timing: selectedTime
        };
    
        try {
            const response = await fetch('http://127.0.0.1:5000/Bookings/myBookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken
                },
                body: JSON.stringify(bookingData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to book');
            }
    
            // Redirect to a different location
            window.location.href = '/confirmation';
        } catch (error) {
            console.error('Error booking:', error.message);
        }
    };
    

    return (
        <div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
            <header className="text-center text-3xl font-bold text-gray-800 mb-4">
                Pricing
                <PricePanel price={price}/>
            </header>
            <br></br>
            <div className="flex justify-center items-center mb-4">
                <Calendar value={date} onChange={onCalendarClick} showIcon/>
            
            </div>
            <div className="flex justify-center items-center mb-4">
                {dropdown.length > 0 ? (
                    <DDropdown drop={dropdown} selectedTime={selectedTime} setselectedTime={setSelectedTime} />

                ) : (
                    "Not Available"
                )}
            </div>
            <div className="text-center m-4">
            {dropdown.length>0?<Button
                    label="Book Now"
                    raised
                    aria-label="Filter"
                    severity="help"
                    size="large"
                    style={{
                        padding: "5px",
                        fontSize: "25px",
                        borderRadius: "12px"
                    }}
                    onClick={bookNow}
                    className="custom-book-now-button"
                />:<Button
                label="Book Now"
                raised
                aria-label="Filter"
                severity="help"
                size="large"
                style={{
                    padding: "5px",
                    fontSize: "25px",
                    borderRadius: "12px",
                    cursor:"not-allowed"
                }}
                
                className="custom-book-now-button"
            />}
                
            </div>
        </div>
    );
};


// const Dropdown1 =({drop})=>{
//     return(
//     <div class="btn-group mx-2">
//     <button class="btn btn-secondary btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
//         {drop[0].time?drop[0].time:"NaN"}
//     </button>
//     <ul class="dropdown-menu">
//     {drop.map(item => {
//          return (<li key={item.id}><a className="dropdown-item" href="#">{item.time}</a></li>)
//     })}
//     </ul>
//     </div>)
// }



function DDropdown({drop,selectedTime,setselectedTime}) {


    const selectedTimeTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    {/* <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} /> */}
                    <div>{option}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const timeOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                {/* <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} /> */}
                <div>{option}</div>
            </div>
        );
    };

    const panelFooterTemplate = () => {
        return (
            <div className="py-2 px-3">
                {selectedTime ? (
                    <span>
                        <b>{selectedTime}</b> selected.
                    </span>
                ) : (
                    'No time selected.'
                )}
            </div>
        );
    };

    return (
        <div className="card flex justify-content-center sm">
            <Dropdown value={selectedTime} onChange={(e) => setselectedTime(e.value)} options={drop} optionLabel="name" placeholder="Select time" 
                valueTemplate={selectedTimeTemplate} itemTemplate={timeOptionTemplate} className="w-full md:w-14rem" panelFooterTemplate={panelFooterTemplate} 
                dropdownIcon={(opts) => {
                    return opts.iconProps['data-pr-overlay-visible'] ? <ChevronRightIcon {...opts.iconProps} /> : <ChevronDownIcon {...opts.iconProps} />;
                }}/>
        </div>    
    )
}




const PricePanel = ({ price }) => {
    const formattedPrice = formatPrice(price);

    return (
        <div className="price-container">
            <div className="price-value">{formattedPrice}</div>
        </div>
    );
};

const formatPrice = (price) => {
    // Custom formatting logic
    
    const cleanedPrice = price.replace(/\$/g, '').trim();
    return `NPR ${cleanedPrice}`; // Example: NPR 123.45 // Example: NPR 123.45 // Example: NPR 123.45
};





function Rate({value,setValue}) {
    

    return (
        <Rating value={value} onChange={(e) => setValue(e.value)} cancel={false} className="rating-custom"/>
        // <div className="card flex justify-content-center border-none">
            
        // </div>
    );
}
        
function DeclarativeDemo() {
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);

    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog
                group="declarative"
                visible={visible}
                onHide={() => setVisible(false)}
                message="Are you sure you want to proceed?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={accept}
                reject={reject}
                style={{ width: '50vw' }}
                breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
            />
            <div className="card flex justify-content-center">
                <Button onClick={() => setVisible(true)} icon="pi pi-check" label="Confirm" />
            </div>
        </>
    )}





        
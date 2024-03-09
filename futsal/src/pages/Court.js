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
import "primereact/resources/themes/bootstrap4-light-purple/theme.css";
import './Court.css';

// function MyComponent() {
//   const navigate = useNavigate();
//   navigate('/bookings');
  
// }




export default function Court(){
    const [images, setImages] = useState([{itemImageSrc:"https://images.ctfassets.net/hrltx12pl8hq/7JnR6tVVwDyUM8Cbci3GtJ/bf74366cff2ba271471725d0b0ef418c/shutterstock_376532611-og.jpg",
    thumbnailImageSrc:""},{itemImageSrc:"https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630",
    thumbnailImageSrc:""}]);
    const {id} = useParams();
    const [value, setValue] = useState(1);
    return (
        <>
        <BookingSection images={images} value={value} setValue={setValue}/>
        
        </>
    )
};

function Gallery({img}) {
    const [images, setImages] = useState(img);
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
        return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%' }} />
    }

    const thumbnailTemplate = (item) => {
        return <img src={item.thumbnailImageSrc} alt={item.alt} />
    }

    return (
        <div className="border-none">
            <Galleria value={images} style={{ maxWidth: '640px' }} showThumbnails={false} showIndicators item={itemTemplate} showItemNavigators/>
        </div>
    )
}

function NoOpBox(){
    return(
      <div style={{height:"15vh",width:"100%"}}></div>
    )
  };

const BookingSection = ({images,value,setValue})=>{
    
    return (
        <>
        <div className="booking-section">
            
        <div class="container text-center">
                <div class="row" >
                    <div class="col-8">
                        <CourtInfo images={images} value={value} setValue={setValue}/>
                    </div>
                    <div class="col bg">
                        <Pricing value={value} setValue={setValue}/>
                    </div>
                    </div>
            </div>
            </div>

        </>
    )
};

const CourtInfo = ({images,value,setValue})=>{
    
    return (
        <>
        <div className="center">
        <Gallery img={images}/>
        </div>
        <div className="container">
            Rating: <Rating value={value} readOnly cancel={false} />
        Velit voluptate labore anim nostrud esse ad sint et cupidatat nulla. Elit et aliquip labore enim ut consequat aliquip ex commodo nulla. Quis tempor culpa velit in non excepteur quis. Cillum enim reprehenderit nisi aliquip nostrud culpa magna culpa ex.

Irure sit adipisicing sint in elit occaecat reprehenderit velit ex. Cillum aute culpa ad sit sint. Pariatur irure aute incididunt consequat veniam eiusmod incididunt incididunt. Adipisicing magna occaecat qui eiusmod ut laborum qui irure ut ipsum id aliqua anim sit.
        </div>
        

        
        </>
    )
}

const Pricing = ({value,setValue}) => {
    const today = new Date();
    const [date, setDate] = useState(today);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const [dropdown, setDropdown] = useState([{ id: 1, time: "12:00" }]);
    const [selectedTime,setSelectedTime] = useState(dropdown[0]);
    const onCalendarClick = (e) => {
        setDate(e.value);
    };

    const bookNow = () => {
        // Redirect to a different location
        <DeclarativeDemo/>
        window.location.href = '/confirmation';
    };


    return (
        <div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
            <header className="text-center text-3xl font-bold text-gray-800 mb-4">
                Pricing
                <PricePanel price={1000}/>
            </header>
            <br></br>
            <div className="flex justify-center items-center mb-4">
                <Calendar value={date} onChange={onCalendarClick} showIcon />
            </div>
            <div className="flex justify-center items-center mb-4">
                {
                    dropdown.length > 0 ? (
                        <DDropdown drop={dropdown} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                    ) :
                        "Not Available"
                }
            </div>
            Rate: <Rate value={value} setValue={setValue}/>
            <div className="text-center m-4">
            <Button label="Book Now" raised aria-label="Filter" severity="help" size="large" style={
                {padding:"5px",
                fontSize:"25px",
                borderRadius:"12px"
        }} onClick={bookNow}/>
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
    const [time,setTimes] = useState([]);
    useEffect(()=>{
        setTimes(drop);
    },[])

    const selectedTimeTemplate = (option, props) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    {/* <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} /> */}
                    <div>{option.time}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const timeOptionTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                {/* <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: '18px' }} /> */}
                <div>{option.time}</div>
            </div>
        );
    };

    const panelFooterTemplate = () => {
        return (
            <div className="py-2 px-3">
                {selectedTime ? (
                    <span>
                        <b>{selectedTime.time}</b> selected.
                    </span>
                ) : (
                    'No time selected.'
                )}
            </div>
        );
    };

    return (
        <div className="card flex justify-content-center sm">
            <Dropdown value={selectedTime} onChange={(e) => setselectedTime(e.value)} options={time} optionLabel="name" placeholder="Select time" 
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
    return `NPR ${price.toFixed(2)}`; // Example: NPR 123.45
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





        
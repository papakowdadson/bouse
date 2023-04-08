import React from 'react';
import {Link} from 'react-router-dom';

import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';

function ListingItem({index,data,id,onDelete}) {
  return (
    <li className="categoryListing">
        <Link to={`/category/${data.type}/${id}`} className="categoryListingLink">
            <img src={data.imageUrls[0]} alt={`image for ${data.name}`  } className='categoryListingImg' />
            <div className="categoryListingDetails">
                <p className="categoryListingLocation">{data.location}</p>
                <p className="categoryListingName">{data.name}</p>

                <p className="categoryListingPrice">
                    ${data.offer=='true'? data.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') : data.regularPrice}
                    {data.type === 'rent' && ' / month'}
                </p>
                <div className="categoryListingInfoDiv">
                <img src={bedIcon} alt='bed'/>
                <p className="categoryListingInfoText">{data.bedroom>1? `${data.bedroom} bedrooms`:`${data.bedroom} bedroom`}</p>

                <img src={bathtubIcon} alt='bed'/>
                <p className="categoryListingInfoText">{data.bathroom>1? `${data.bathroom} bathrooms`:`${data.bathroom} bathroom`}</p>
                </div>
            </div>
        </Link>
        {onDelete && <DeleteIcon className='removeIcon' fill='red' onClick={()=>onDelete(id)}/>}
    </li>
  )
}

export default ListingItem
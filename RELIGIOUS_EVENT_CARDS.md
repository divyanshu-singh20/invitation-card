# Religious Event Cards Feature

## Overview
Religious event card customization form has been successfully implemented for categories including:
- All Puja Cards
- Grih Pravesh Cards
- Satyanarayan Katha
- Religious Events

## Implementation Details

### 1. Card Type Detection
The system automatically detects religious event cards using the `getCardType()` function which checks:
- Category name: "religious-events"
- Subcategory: "puja", "grih pravesh", "satyanarayan"
- Product title keywords: "puja", "grih pravesh", "satyanarayan"

### 2. Form Structure (3 Steps)

#### Step 1: Event Information
- **Event Name**: Dropdown selection
  - Grih Pravesh
  - Satyanarayan Katha
  - Puja
  - Havan
  - Mundan
  - Annaprashan
  - Other (custom event)
- **Host Name / Family Name**: Text input for the hosting family
- **Invitation Line**: Textarea for custom invitation text (e.g., "You are cordially invited to attend...")
- **Language**: Dropdown selection
  - Hindi
  - English
  - Sanskrit
  - Bilingual (Hindi & English)

#### Step 2: Venue Details
- **Event Date**: Date picker
- **Event Time**: Time picker
- **Venue Name**: Text input for venue/temple name
- **Venue Address**: Textarea for complete address

#### Step 3: Contact Information
- **Contact Number**: 10-digit phone number input
- **Order Summary**: Visual summary card showing:
  - Event name
  - Host name
  - Date and time
  - Venue and address
  - Contact number

### 3. State Management

```javascript
const [religiousDetails, setReligiousDetails] = useState({
  eventName: '',
  hostName: '',
  invitationLine: '',
  eventDate: '',
  eventTime: '',
  venue: '',
  venueAddress: '',
  language: 'hindi',
  contactNumber: ''
});
```

### 4. UI/UX Features
- **Color Theme**: Orange (#ff6b35) - representing spirituality and religious significance
- **Progress Indicators**: 3-step visual progress bar
- **Step Navigation**:
  - Back button on all steps (closes modal on step 1)
  - Previous button enabled on steps 2-3
  - Next button on steps 1-2
  - "Pay Now" button on final step (step 3)
- **Responsive Design**: Fully mobile-friendly
- **Form Validation**: HTML5 required fields

### 5. Data Flow
1. User selects religious event card and clicks "Buy Now"
2. Chooses "Fill details manually" option
3. Completes all 3 steps with event details
4. Reviews order summary on step 3
5. Clicks "Pay Now" to proceed to checkout
6. Religious details passed to checkout page with product and quantity

### 6. Backend Integration
The religious event details are sent to the checkout page and will be stored in the order with the following structure:

```javascript
{
  product: {...},
  quantity: Number,
  cardDetails: {
    eventName: String,
    hostName: String,
    invitationLine: String,
    eventDate: String,
    eventTime: String,
    venue: String,
    venueAddress: String,
    language: String,
    contactNumber: String
  },
  orderType: 'manual'
}
```

## Files Modified
- `frontend/src/pages/ProductDetailPage.jsx`
  - Added `religiousDetails` state (lines 146-156)
  - Added `updateReligiousDetails()` function (lines 325-327)
  - Updated `getCardType()` to detect religious category (lines 349-365)
  - Updated `handleSaveDetails()` to send religious details (lines 299-313)
  - Added form headers for religious events (line ~1170)
  - Added step indicators for 3-step flow (line ~1200)
  - Implemented complete 3-step religious event form (lines ~1710-1900)
  - Updated navigation buttons to handle 3 steps (lines 2564-2567)

## Testing Checklist
- [ ] Religious event cards are detected correctly
- [ ] Form displays with all 3 steps
- [ ] Step navigation works (Previous/Next buttons)
- [ ] All fields are editable
- [ ] Date picker works correctly
- [ ] Time picker works correctly
- [ ] Event name dropdown shows all options
- [ ] Language selector works
- [ ] Phone number accepts 10 digits
- [ ] Order summary displays all entered details
- [ ] Pay Now button navigates to checkout
- [ ] Religious details are passed to checkout page
- [ ] Order can be created with religious event details

## Usage Example

### Creating a Religious Event Card Order
1. Navigate to a religious event card (e.g., "Grih Pravesh Card")
2. Click "Buy Now"
3. Select "Fill details manually"
4. **Step 1 - Event Info**:
   - Select event: "Grih Pravesh"
   - Enter host name: "Sharma Family"
   - Enter invitation: "You are cordially invited to attend the Grih Pravesh ceremony"
   - Select language: "Hindi"
   - Click "Next Step"
5. **Step 2 - Venue Details**:
   - Select date: "2024-12-15"
   - Enter time: "11:00"
   - Enter venue: "Krishna Temple"
   - Enter address: "123 Temple Road, Delhi - 110001"
   - Click "Next Step"
6. **Step 3 - Contact**:
   - Enter phone: "9876543210"
   - Review order summary
   - Click "Pay Now - ₹{total}"

## Future Enhancements
- [ ] Add photo upload for religious event cards
- [ ] Add custom message/blessing field
- [ ] Add priest name field for specific ceremonies
- [ ] Add muhurat (auspicious time) field
- [ ] Add dress code/theme field
- [ ] Add RSVP functionality
- [ ] Email/SMS invitation preview
- [ ] Multilingual invitation templates
- [ ] Religious symbol/deity selection
- [ ] Audio invitation option (mantra/bhajan)

## Notes
- All required fields are marked with asterisks (*)
- Form uses orange theme (#ff6b35) to represent religious/spiritual context
- Default language is Hindi for religious events
- Contact number must be exactly 10 digits
- Date cannot be in the past (HTML5 validation)
- Form is fully responsive for mobile devices

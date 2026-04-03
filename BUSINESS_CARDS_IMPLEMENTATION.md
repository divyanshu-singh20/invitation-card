# Business Card Types Implementation

## Overview
Three new professional card categories have been successfully added to the wedding card platform:
1. **Visiting Cards** (Business Cards)
2. **Letterheads**
3. **Shop/Office Opening Cards**

## Implementation Details

### 1. Visiting Cards 💼
**Detection:** Keywords - "visiting", "business card"
**Color Theme:** Teal (#0d9488)
**Form Type:** Single-page form
**Steps:** 1 step (no navigation needed)

#### Fields Required:
- ✅ Business / Company Name *
- ✅ Person Name *
- ✅ Designation * (e.g., CEO, Manager, Director)
- ✅ Mobile Number * (10 digits)
- ✅ Email ID (optional)
- ✅ Address * (complete business address)

#### Features:
- Professional teal color scheme
- Single-page form with all fields visible
- Live preview card showing entered details
- Direct "Pay Now" button (no multi-step navigation)
- Form validation for required fields
- Email validation for email field
- 10-digit phone number limit

---

### 2. Letterheads 📄
**Detection:** Keywords - "letterhead"
**Color Theme:** Indigo (#4f46e5)
**Form Type:** Single-page form
**Steps:** 1 step (no navigation needed)

#### Fields Required:
- ✅ Business / Company Name *
- ✅ Address * (complete business address)
- ✅ Mobile / Contact Number * (10 digits)
- ✅ Email ID *
- ✅ GST Number (optional, 15 digits)

#### Features:
- Professional indigo color scheme
- Single-page form layout
- GST number field with 15-character limit
- Live preview showing company details
- Direct "Pay Now" button
- Email validation
- Optional GST for non-GST businesses

---

### 3. Shop/Office Opening Cards 🎉
**Detection:** Keywords - "shop opening", "office opening", "inauguration"
**Color Theme:** Blue (#3b82f6)
**Form Type:** Multi-step form
**Steps:** 2 steps with navigation

#### Step 1: Business Information
- ✅ Business / Shop Name *
- ✅ Opening Occasion * (dropdown)
  - Shop Opening
  - Office Opening
  - Inauguration
  - Grand Opening
  - Store Launch
  - Business Opening
- ✅ Invitation Line * (custom text area)

#### Step 2: Event Details
- ✅ Date * (date picker)
- ✅ Time * (time picker)
- ✅ Address / Venue * (full address)
- ✅ Contact Number * (10 digits)
- ✅ Order Summary Card (visual preview)

#### Features:
- Blue color theme for professional appearance
- 2-step navigation (Previous/Next buttons)
- Occasion dropdown with common event types
- Customizable invitation text
- Date and time pickers
- Visual summary card on final step
- Step indicators showing progress (2 circles)

---

## Technical Implementation

### State Management
```javascript
// Visiting Card State
const [visitingCardDetails, setVisitingCardDetails] = useState({
  businessName: '',
  personName: '',
  designation: '',
  mobileNumber: '',
  address: '',
  emailId: ''
});

// Letterhead State
const [letterheadDetails, setLetterheadDetails] = useState({
  businessName: '',
  address: '',
  contactNumber: '',
  emailId: '',
  gstNumber: ''
});

// Shop Opening State
const [shopOpeningDetails, setShopOpeningDetails] = useState({
  businessName: '',
  openingOccasion: 'Shop Opening',
  eventDate: '',
  eventTime: '',
  venue: '',
  invitationLine: 'You are cordially invited…',
  contactNumber: ''
});
```

### Card Type Detection (getCardType function)
```javascript
// Visiting Cards
if (category.includes('visiting') || category.includes('business card') || 
    subCategory.includes('visiting') || title.includes('visiting card') || 
    title.includes('business card')) {
  return 'visiting';
}

// Letterheads
if (category.includes('letterhead') || subCategory.includes('letterhead') || 
    title.includes('letterhead')) {
  return 'letterhead';
}

// Shop Opening Cards
if (category.includes('shop opening') || category.includes('office opening') || 
    category.includes('inauguration') || title.includes('shop opening') || 
    title.includes('office opening') || title.includes('inauguration')) {
  return 'shopOpening';
}
```

### Navigation Logic
```javascript
// Step count per card type:
// - visiting, letterhead: 1 step (single page)
// - shopOpening: 2 steps
// - religious: 3 steps
// - birthday, anniversary: 4 steps
// - wedding: 6 steps

activeStep < (
  getCardType() === 'visiting' || getCardType() === 'letterhead' ? 1 : 
  getCardType() === 'shopOpening' ? 2 : 
  getCardType() === 'religious' ? 3 : 
  getCardType() === 'birthday' || getCardType() === 'anniversary' ? 4 : 6
)
```

### Form Headers
- **Visiting Cards:** "📝 Visiting Card Details" - "Fill in business card information"
- **Letterheads:** "📝 Letterhead Details" - "Fill in company letterhead details"
- **Shop Opening:** "📝 Opening Invitation Details" - "Fill in shop/office opening details"

### Step Indicators
**Shop Opening (2 steps):**
- Step 1: "Business Info" (blue circle)
- Step 2: "Event Details" (blue circle)

**Visiting & Letterhead:**
- No step indicators (single page forms)

---

## Files Modified
### frontend/src/pages/ProductDetailPage.jsx
1. **Added States** (Lines 157-189)
   - visitingCardDetails
   - letterheadDetails
   - shopOpeningDetails

2. **Added Update Functions** (Lines 385-397)
   - updateVisitingCardDetails()
   - updateLetterheadDetails()
   - updateShopOpeningDetails()

3. **Updated getCardType()** (Lines 425-460)
   - Added detection for visiting, letterhead, shopOpening

4. **Updated handleSaveDetails()** (Lines 329-349)
   - Added handling for new card types

5. **Updated Form Headers** (Lines 1248-1263)
   - Added titles and descriptions for new card types

6. **Added Step Indicators** (Lines 1329-1353)
   - Added 2-step indicator for shop opening cards

7. **Added Form UIs** (Lines 1984-2293)
   - Complete visiting card form with preview
   - Complete letterhead form with preview
   - 2-step shop opening form with summary

8. **Updated Navigation Buttons** (Lines 2963-2997)
   - Updated step count logic for all card types
   - Added color themes for new card types

---

## Color Themes Summary
| Card Type | Primary Color | Hex Code | Use Case |
|-----------|--------------|----------|----------|
| Visiting Card | Teal | #0d9488 | Professional business cards |
| Letterhead | Indigo | #4f46e5 | Corporate letterheads |
| Shop Opening | Blue | #3b82f6 | Business inaugurations |
| Religious Event | Orange | #ff6b35 | Spiritual ceremonies |
| Birthday | Pink | #ec4899 | Birthday parties |
| Anniversary | Purple | #a855f7 | Anniversary celebrations |
| Wedding | Red | #ef4444 | Wedding invitations |

---

## Usage Examples

### 1. Creating a Visiting Card Order
1. Navigate to a visiting card product
2. Click "Buy Now"
3. Select "Fill details manually"
4. Fill in all fields:
   - Company: "TechCorp Solutions"
   - Name: "Rajesh Kumar"
   - Designation: "CEO & Founder"
   - Mobile: "9876543210"
   - Email: "rajesh@techcorp.com"
   - Address: "123 Business Park, Mumbai - 400001"
5. Review preview card
6. Click "Pay Now - ₹{amount}"

### 2. Creating a Letterhead
1. Navigate to a letterhead product
2. Click "Buy Now"
3. Select "Fill details manually"
4. Fill in company details:
   - Company: "ABC Enterprises Pvt Ltd"
   - Address: "456 Industrial Area, Delhi - 110001"
   - Contact: "9876543210"
   - Email: "info@abcenterprises.com"
   - GST: "27AABCU9603R1ZV" (if applicable)
5. Review preview
6. Click "Pay Now"

### 3. Creating Shop Opening Invitation
1. Navigate to shop opening card
2. Click "Buy Now"
3. Select "Fill details manually"
4. **Step 1 - Business Info:**
   - Business: "Fresh Mart Supermarket"
   - Occasion: "Grand Opening"
   - Invitation: "You are cordially invited to the grand opening celebration..."
   - Click "Next Step"
5. **Step 2 - Event Details:**
   - Date: "2026-01-15"
   - Time: "10:00"
   - Venue: "Shop No. 45, City Center Mall, Pune - 411001"
   - Contact: "9876543210"
   - Review summary card
   - Click "Pay Now"

---

## Validation Rules
| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| Business Name | Text | Required | "Please enter business name" |
| Person Name | Text | Required | "Please enter full name" |
| Designation | Text | Required | "Please enter designation" |
| Mobile Number | Tel | Required, 10 digits | "Please enter 10-digit mobile number" |
| Email ID | Email | Format validation | "Please enter valid email" |
| Address | Textarea | Required | "Please enter complete address" |
| GST Number | Text | 15 characters max | "GST should be 15 characters" |
| Date | Date | Required | "Please select event date" |
| Time | Time | Required | "Please select event time" |

---

## Testing Checklist
### Visiting Cards
- [ ] Form displays correctly
- [ ] All fields are editable
- [ ] Email validation works
- [ ] Phone number accepts only 10 digits
- [ ] Preview card shows all entered details
- [ ] Pay Now button navigates to checkout
- [ ] Data is passed to checkout page

### Letterheads
- [ ] Form displays correctly
- [ ] GST field is optional
- [ ] GST accepts 15 characters
- [ ] Email validation works
- [ ] Preview shows all details including GST
- [ ] Checkout receives correct data

### Shop Opening Cards
- [ ] 2-step navigation works
- [ ] Previous/Next buttons function correctly
- [ ] Occasion dropdown shows all options
- [ ] Date picker works
- [ ] Time picker works
- [ ] Summary card displays on step 2
- [ ] All data is captured correctly
- [ ] Checkout receives complete details

---

## Future Enhancements
### Visiting Cards
- [ ] Add company logo upload
- [ ] Add QR code with contact details
- [ ] Add social media links (LinkedIn, WhatsApp)
- [ ] Add website URL field
- [ ] Multiple color theme options

### Letterheads
- [ ] Add company logo upload
- [ ] Add header/footer customization
- [ ] Add multiple contact numbers
- [ ] Add fax number field
- [ ] Add CIN/PAN fields

### Shop Opening Cards
- [ ] Add chief guest name field
- [ ] Add special instructions field
- [ ] Add dress code field
- [ ] Add RSVP option
- [ ] Add location map integration
- [ ] Photo upload for shop/business

---

## API Integration Notes
When orders are created, the cardDetails will contain the respective state object:
```javascript
// Visiting Card Order
{
  product: {...},
  quantity: 100,
  cardDetails: {
    businessName: "TechCorp Solutions",
    personName: "Rajesh Kumar",
    designation: "CEO",
    mobileNumber: "9876543210",
    address: "123 Business Park...",
    emailId: "rajesh@techcorp.com"
  },
  orderType: 'manual'
}

// Letterhead Order
{
  product: {...},
  quantity: 500,
  cardDetails: {
    businessName: "ABC Enterprises",
    address: "456 Industrial Area...",
    contactNumber: "9876543210",
    emailId: "info@abc.com",
    gstNumber: "27AABCU9603R1ZV"
  },
  orderType: 'manual'
}

// Shop Opening Order
{
  product: {...},
  quantity: 200,
  cardDetails: {
    businessName: "Fresh Mart",
    openingOccasion: "Grand Opening",
    eventDate: "2026-01-15",
    eventTime: "10:00",
    venue: "Shop No. 45...",
    invitationLine: "You are cordially...",
    contactNumber: "9876543210"
  },
  orderType: 'manual'
}
```

---

## Notes
- All three card types use professional color schemes suitable for business context
- Visiting cards and letterheads are single-page forms for quick ordering
- Shop opening uses 2-step form for better UX with event details
- All forms include live preview/summary cards
- Forms are fully responsive for mobile devices
- Consistent with existing card type implementations
- Ready for production use

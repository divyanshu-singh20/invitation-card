import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Toast from '../components/Toast';
import api, { getImageUrl } from '../utils/api';
import { addToCart, addToWishlist, isInWishlist, removeFromWishlist } from '../utils/userStorage';

// Import Card Form Components
import AnniversaryCardForm from '../components/cardForms/AnniversaryCardForm';
import BirthdayCardForm from '../components/cardForms/BirthdayCardForm';
import CalendarsDiariesForm from '../components/cardForms/CalendarsDiariesForm';
import CertificatesAwardsForm from '../components/cardForms/CertificatesAwardsForm';
import CondolenceShraddForm from '../components/cardForms/CondolenceShraddForm';
import DigitalInvitationsForm from '../components/cardForms/DigitalInvitationsForm';
import FlexBannerPosterForm from '../components/cardForms/FlexBannerPosterForm';
import LetterheadForm from '../components/cardForms/LetterheadForm';
import PersonalizedGiftsForm from '../components/cardForms/PersonalizedGiftsForm';
import ReligiousEventCardForm from '../components/cardForms/ReligiousEventCardForm';
import SchoolCollegePrintingForm from '../components/cardForms/SchoolCollegePrintingForm';
import ShopOpeningCardForm from '../components/cardForms/ShopOpeningCardForm';
import StickersLabelsForm from '../components/cardForms/StickersLabelsForm';
import VisitingCardForm from '../components/cardForms/VisitingCardForm';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const similarScrollRef = useRef(null);
  
  // Toast State
  const [toast, setToast] = useState(null);
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0
  });
  const [loadingReviews, setLoadingReviews] = useState(false);
  
  // Buy Now Modal State
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [orderMode, setOrderMode] = useState(null); // 'contact' or 'manual'
  const [activeStep, setActiveStep] = useState(1);
  
  // Quick Contact Form State (Option 1)
  const [quickContact, setQuickContact] = useState({
    fullName: '',
    mobileNumber: '',
    message: ''
  });
  
  // Wedding Card Details Form State
  const [cardDetails, setCardDetails] = useState({
    // Groom Details
    groomFullName: '',
    groomFatherName: '',
    groomMotherName: '',
    groomVillageCity: '',
    groomPostArea: '',
    groomDistrict: '',
    groomState: '',
    groomPincode: '',
    
    // Bride Details
    brideFullName: '',
    brideFatherName: '',
    brideMotherName: '',
    brideVillageCity: '',
    bridePostArea: '',
    brideDistrict: '',
    brideState: '',
    bridePincode: '',
    
    // Host Details
    invitedBy: '',
    invitationLine: 'आपको सपरिवार शुभ विवाह में सादर आमंत्रित करते हैं',
    
    // Family Members
    groomFamilyMembers: [''],
    brideFamilyMembers: [''],
    
    // Wedding Events
    events: [
      { eventName: 'Haldi', eventDate: '', eventDay: '', eventTime: '', eventDescription: '' }
    ],
    
    // Main Wedding
    weddingDate: '',
    weddingDay: '',
    weddingMuhurat: '',
    samvat: '',
    
    // Venue
    venueName: '',
    venueFullAddress: '',
    venueCity: '',
    venueState: '',
    venuePincode: '',
    venueLandmark: '',
    
    // Reception
    receptionDate: '',
    receptionTime: '',
    receptionVenue: 'same',
    receptionVenueAddress: '',
    
    // Contact
    contactPersonName: '',
    mobileNumber: '',
    alternateNumber: '',
    
    // Additional
    specialMessage: '',
    guestInstructions: '',
    
    // Language
    cardLanguage: 'hindi'
  });

  // Birthday Card Details State
  const [birthdayDetails, setBirthdayDetails] = useState({
    childName: '',
    age: '',
    birthdayNumber: '', // 1st, 2nd, 5th etc
    birthdayDate: '',
    birthdayTime: '',
    venue: '',
    venueAddress: '',
    theme: '', // Cartoon, Superhero, Princess, Car, Jungle etc
    photo: null,
    photoPreview: '',
    invitationMessage: '',
    parentsName: '', // From: Mommy–Daddy
    language: 'english', // English / Hindi / Hinglish
    contactNumber: ''
  });

  // Anniversary Card Details State
  const [anniversaryDetails, setAnniversaryDetails] = useState({
    coupleName: '',
    anniversaryType: '', // 1st, 10th, 25th, 50th etc
    anniversaryDate: '',
    anniversaryTime: '',
    venue: '',
    venueAddress: '',
    hostName: '', // Children / Family
    invitationMessage: '',
    quote: '',
    photo: null,
    photoPreview: '',
    themeColorPreference: '', // Floral, Classic, Royal etc
    language: 'english', // English / Hindi / Hinglish
    contactNumber: ''
  });

  // Religious Event Card Details State (Puja, Grih Pravesh, Satyanarayan Katha)
  const [religiousDetails, setReligiousDetails] = useState({
    eventName: '', // Grih Pravesh / Satyanarayan Katha / Puja
    hostName: '', // Host Name / Family Name
    invitationLine: 'You are cordially invited to attend…',
    eventDate: '',
    eventTime: '',
    venue: '',
    venueAddress: '',
    language: 'hindi', // Hindi / English / Sanskrit
    contactNumber: ''
  });

  // Visiting Card Details State
  const [visitingCardDetails, setVisitingCardDetails] = useState({
    businessName: '',
    personName: '',
    designation: '',
    mobileNumber: '',
    address: '',
    emailId: ''
  });

  // Letterhead Details State
  const [letterheadDetails, setLetterheadDetails] = useState({
    businessName: '',
    address: '',
    contactNumber: '',
    emailId: '',
    gstNumber: ''
  });

  // Shop Opening Details State
  const [shopOpeningDetails, setShopOpeningDetails] = useState({
    businessName: '',
    openingOccasion: 'Shop Opening',
    eventDate: '',
    eventTime: '',
    venue: '',
    invitationLine: 'You are cordially invited to attend…',
    contactNumber: ''
  });

  // Flex/Banner/Poster Details State
  const [flexBannerDetails, setFlexBannerDetails] = useState({
    contentText: '',
    size: '',
    customSize: '',
    purpose: '',
    language: '',
    contactNumber: ''
  });

  // Stickers & Labels Details State
  const [stickersLabelsDetails, setStickersLabelsDetails] = useState({
    textBrandName: '',
    size: '',
    customSize: '',
    shape: '',
    material: '',
    additionalDetails: '',
    contactNumber: ''
  });

  // Calendars & Diaries Details State
  const [calendarsDiariesDetails, setCalendarsDiariesDetails] = useState({
    type: '',
    year: '',
    businessPersonName: '',
    contactNumber: '',
    emailId: '',
    address: '',
    logoPreview: '',
    specialRequirements: ''
  });

  // Certificates & Awards Details State
  const [certificatesAwardsDetails, setCertificatesAwardsDetails] = useState({
    organizationName: '',
    recipientName: '',
    awardTitle: '',
    date: '',
    signatoryName: '',
    signatoryDesignation: '',
    description: '',
    certificateType: '',
    paperQuality: '',
    contactNumber: ''
  });

  // Condolence/Shraddh Details State
  const [condolenceShraddDetails, setCondolenceShraddDetails] = useState({
    deceasedName: '',
    eventType: '',
    date: '',
    time: '',
    venueName: '',
    address: '',
    familyName: '',
    language: 'hindi',
    contactNumber: '',
    additionalMessage: ''
  });

  // School/College Printing Details State
  const [schoolCollegeDetails, setSchoolCollegeDetails] = useState({
    institutionName: '',
    documentType: '',
    quantity: '',
    contentText: '',
    paperSize: '',
    colorOption: '',
    printingSide: '',
    binding: '',
    contactPersonName: '',
    contactNumber: '',
    deliveryDate: '',
    specialInstructions: ''
  });

  // Personalized Gifts Details State
  const [personalizedGiftsDetails, setPersonalizedGiftsDetails] = useState({
    productType: '',
    quantity: '',
    textToPrint: '',
    tshirtSize: '',
    tshirtColor: '',
    frameSize: '',
    printingType: '',
    photoPreview: '',
    message: '',
    occasion: '',
    contactNumber: ''
  });

  // Digital Invitations Details State
  const [digitalInvitationsDetails, setDigitalInvitationsDetails] = useState({
    eventType: '',
    cardFormat: '',
    names: '',
    eventDate: '',
    eventTime: '',
    venueName: '',
    address: '',
    googleMapsLink: '',
    contactNumber: '',
    invitationMessage: '',
    theme: '',
    backgroundMusic: '',
    photoPreviews: [],
    specialRequirements: ''
  });

  // Customization State
  const [customization, setCustomization] = useState({
    groomName: '',
    brideName: '',
    weddingDate: '',
    weddingTime: '',
    venue: '',
    venueAddress: '',
    language: 'hindi',
    fontStyle: 'traditional',
    fontColor: '#8B0000'
  });

  // Accordion States
  const [openAccordions, setOpenAccordions] = useState({
    customization: true,
    cardDetails: false,
    packageIncludes: false,
    sellerInfo: false
  });

  // Mock Reviews
  // const reviews = [
  //   { id: 1, name: 'Priya Sharma', rating: 5, date: '15 Dec 2025', comment: 'Beautiful card! The quality exceeded my expectations. Everyone at the wedding loved it.', images: [] },
  //   { id: 2, name: 'Rahul Verma', rating: 4, date: '10 Dec 2025', comment: 'Good quality and timely delivery. The customization was exactly as I wanted.', images: [] },
  //   { id: 3, name: 'Anita Patel', rating: 5, date: '05 Dec 2025', comment: 'Absolutely stunning! The gold foiling is so elegant. Highly recommend!', images: [] },
  // ];

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product?.slug) {
      fetchReviews();
    }
  }, [product]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await api.get(`/reviews/product/${product.slug}`);
      if (response.data.success) {
        setReviews(response.data.data);
        setReviewStats(response.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (product?.minimumOrder) {
      setQuantity(product.minimumOrder);
    }
  }, [product]);

  // Check if product is in wishlist
  useEffect(() => {
    if (product) {
      const productId = product.id || product._id || product.slug;
      setIsWishlisted(isInWishlist(productId));
    }
  }, [product]);

  // Open Buy Now modal if navigated from cart
  useEffect(() => {
    if (product && location.state?.openBuyNow) {
      setShowBuyNowModal(true);
      // Set quantity from cart if provided
      if (location.state?.quantity) {
        setQuantity(location.state.quantity);
      }
      // Clear the state to prevent re-opening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [product, location.state]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/slug/${slug}`);
      if (response.data.success) {
        setProduct(response.data.data);
        fetchRelatedProducts(response.data.data._id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/related`);
      if (response.data.success) {
        setRelatedProducts(response.data.data);
      }
    } catch (err) {
      // Silent fail
    }
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => prev === 0 ? (product.images?.length || 1) - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => prev === (product.images?.length || 1) - 1 ? 0 : prev + 1);
  };

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);
      setDeliveryInfo(`✓ Delivery by ${deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}`);
    } else {
      setDeliveryInfo('Please enter a valid 6-digit pincode');
    }
  };

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getDiscountPercent = () => {
    if (product?.originalPrice && product?.basePrice && product.originalPrice > product.basePrice) {
      return Math.round((1 - product.basePrice / product.originalPrice) * 100);
    }
    return 0;
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddToCart = () => {
    const result = addToCart(product, quantity);
    showToast(result.message, result.success ? 'success' : 'error');
  };

  const handleToggleWishlist = () => {
    const productId = product.id || product._id || product.slug;
    if (isWishlisted) {
      const result = removeFromWishlist(productId);
      setIsWishlisted(false);
      showToast(result.message, 'info');
    } else {
      const result = addToWishlist(product);
      setIsWishlisted(true);
      showToast(result.message, result.success ? 'success' : 'info');
    }
  };

  const handleBuyNow = () => {
    setShowBuyNowModal(true);
    setOrderMode(null); // Reset to show choice screen
    setActiveStep(1);
  };

  const handleSaveDetails = () => {
    // Save details and proceed to payment
    const cardType = getCardType();
    let details = cardDetails;
    
    if (cardType === 'birthday') {
      details = birthdayDetails;
    } else if (cardType === 'anniversary') {
      details = anniversaryDetails;
    } else if (cardType === 'religious') {
      details = religiousDetails;
    } else if (cardType === 'visiting') {
      details = visitingCardDetails;
    } else if (cardType === 'letterhead') {
      details = letterheadDetails;
    } else if (cardType === 'shopOpening') {
      details = shopOpeningDetails;
    }
    
    navigate('/checkout', { state: { product, quantity, cardDetails: details, orderType: 'manual' } });
  };

  const handleQuickCheckout = () => {
    // Quick order - details will be shared on call
    navigate('/checkout', { 
      state: { 
        product, 
        quantity, 
        quickContact, 
        orderType: 'contact',
        orderNote: 'Details will be shared on call'
      } 
    });
  };

  const handleCallNow = () => {
    window.location.href = 'tel:+919876543210'; // Replace with actual number
  };

  const handleWhatsAppChat = () => {
    const text = `Hi! I want to order "${product?.title}" - ${quantity} cards. My name is ${quickContact.fullName}. ${quickContact.message ? `Message: ${quickContact.message}` : ''}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank'); // Replace with actual number
  };

  const updateCardDetails = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateBirthdayDetails = (field, value) => {
    setBirthdayDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateAnniversaryDetails = (field, value) => {
    setAnniversaryDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateReligiousDetails = (field, value) => {
    setReligiousDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateVisitingCardDetails = (field, value) => {
    setVisitingCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateLetterheadDetails = (field, value) => {
    setLetterheadDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateShopOpeningDetails = (field, value) => {
    setShopOpeningDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateFlexBannerDetails = (field, value) => {
    setFlexBannerDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateStickersLabelsDetails = (field, value) => {
    setStickersLabelsDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateCalendarsDiariesDetails = (field, value) => {
    setCalendarsDiariesDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateCertificatesAwardsDetails = (field, value) => {
    setCertificatesAwardsDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateCondolenceShraddDetails = (field, value) => {
    setCondolenceShraddDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateSchoolCollegeDetails = (field, value) => {
    setSchoolCollegeDetails(prev => ({ ...prev, [field]: value }));
  };

  const updatePersonalizedGiftsDetails = (field, value) => {
    setPersonalizedGiftsDetails(prev => ({ ...prev, [field]: value }));
  };

  const updateDigitalInvitationsDetails = (field, value) => {
    setDigitalInvitationsDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e, cardType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (cardType === 'birthday') {
          setBirthdayDetails(prev => ({
            ...prev,
            photo: file,
            photoPreview: reader.result
          }));
        } else if (cardType === 'anniversary') {
          setAnniversaryDetails(prev => ({
            ...prev,
            photo: file,
            photoPreview: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to detect card type from category
  const getCardType = () => {
    const category = product?.category?.toLowerCase() || '';
    const subCategory = product?.subCategory?.toLowerCase() || '';
    const title = product?.title?.toLowerCase() || '';
    
    // Check for visiting cards
    if (category.includes('visiting') || category.includes('business') || 
        subCategory.includes('visiting') || subCategory.includes('business') ||
        title.includes('visiting') || title.includes('business')) {
      return 'visiting';
    }
    
    // Check for letterheads
    if (category.includes('letterhead') || subCategory.includes('letterhead') || 
        title.includes('letterhead')) {
      return 'letterhead';
    }
    
    // Check for shop/office opening cards
    if (category.includes('shop') && (category.includes('opening') || category.includes('office')) || 
        category.includes('inauguration') || 
        subCategory.includes('shop') && (subCategory.includes('opening') || subCategory.includes('office')) || 
        title.includes('shop') && title.includes('opening') || 
        title.includes('office') && title.includes('opening') || 
        title.includes('inauguration')) {
      return 'shopOpening';
    }

    // Check for flex/banner/poster
    if (category.includes('flex') || category.includes('banner') || category.includes('poster') ||
        subCategory.includes('flex') || subCategory.includes('banner') || title.includes('flex') ||
        title.includes('banner') || title.includes('poster')) {
      return 'flexBanner';
    }

    // Check for stickers & labels
    if (category.includes('sticker') || category.includes('label') || 
        subCategory.includes('sticker') || subCategory.includes('label') ||
        title.includes('sticker') || title.includes('label')) {
      return 'stickers';
    }

    // Check for calendars & diaries
    if (category.includes('calendar') || category.includes('diary') || category.includes('planner') ||
        subCategory.includes('calendar') || subCategory.includes('diary') ||
        title.includes('calendar') || title.includes('diary')) {
      return 'calendars';
    }

    // Check for certificates & awards
    if (category.includes('certificate') || category.includes('award') ||
        subCategory.includes('certificate') || subCategory.includes('award') ||
        title.includes('certificate') || title.includes('award')) {
      return 'certificates';
    }

    // Check for condolence/shraddh cards
    if (category.includes('condolence') || category.includes('shraddh') || category.includes('memorial') ||
        subCategory.includes('condolence') || subCategory.includes('shraddh') ||
        title.includes('condolence') || title.includes('shraddh') || title.includes('terahvi') || title.includes('barsi')) {
      return 'condolence';
    }

    // Check for school/college printing
    if (category.includes('school') || category.includes('college') || category.includes('educational') ||
        subCategory.includes('school') || subCategory.includes('college') ||
        title.includes('school') || title.includes('college') || title.includes('id card')) {
      return 'schoolCollege';
    }

    // Check for personalized gifts
    if (category.includes('gift') || category.includes('personalized') || category.includes('mug') ||
        category.includes('t-shirt') || subCategory.includes('gift') || subCategory.includes('personalized') ||
        title.includes('gift') || title.includes('mug') || title.includes('t-shirt') || title.includes('keychain')) {
      return 'gifts';
    }

    // Check for digital invitations
    if (category.includes('digital') || category.includes('qr code') || category.includes('e-invitation') ||
        subCategory.includes('digital') || subCategory.includes('qr') ||
        title.includes('digital') || title.includes('qr code') || title.includes('e-invitation')) {
      return 'digital';
    }
    
    if (category.includes('birthday') || title.includes('birthday') || subCategory.includes('birthday')) {
      return 'birthday';
    } else if (category.includes('anniversary') || title.includes('anniversary') || subCategory.includes('anniversary')) {
      return 'anniversary';
    } else if (category.includes('religious') || category.includes('puja') || category.includes('grih') ||
               title.includes('puja') || title.includes('grih') || title.includes('satyanarayan') || 
               subCategory.includes('puja') || subCategory.includes('religious')) {
      return 'religious';
    }
    return 'wedding'; // default
  };

  // Helper function to get title and description for each card type
  const getCardTypeInfo = () => {
    const cardType = getCardType();
    const info = {
      'birthday': { title: 'Birthday Card Details', description: 'Fill in birthday party details' },
      'anniversary': { title: 'Anniversary Invitation Details', description: 'Fill in anniversary celebration details' },
      'religious': { title: 'Religious Event Details', description: 'Fill in religious event details' },
      'visiting': { title: 'Visiting Card Details', description: 'Fill in business card information' },
      'letterhead': { title: 'Letterhead Details', description: 'Fill in company letterhead details' },
      'shopOpening': { title: 'Opening Invitation Details', description: 'Fill in shop/office opening details' },
      'flexBanner': { title: 'Flex / Banner / Poster Details', description: 'Fill in printing details for flex/banner/poster' },
      'stickers': { title: 'Stickers & Labels Details', description: 'Fill in sticker/label printing details' },
      'calendars': { title: 'Calendars & Diaries Details', description: 'Fill in calendar/diary customization details' },
      'certificates': { title: 'Certificates & Awards Details', description: 'Fill in certificate/award details' },
      'condolence': { title: 'Condolence / Shraddh Card Details', description: 'Fill in memorial card details' },
      'schoolCollege': { title: 'School / College Printing Details', description: 'Fill in educational printing details' },
      'gifts': { title: 'Personalized Gifts Details', description: 'Fill in gift customization details' },
      'digital': { title: 'Digital Invitations Details', description: 'Fill in digital invitation details' },
      'wedding': { title: 'Wedding Card Details', description: 'Fill in your wedding details for the card' }
    };
    return info[cardType] || info['wedding'];
  };

  const addFamilyMember = (side) => {
    const field = side === 'groom' ? 'groomFamilyMembers' : 'brideFamilyMembers';
    setCardDetails(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateFamilyMember = (side, index, value) => {
    const field = side === 'groom' ? 'groomFamilyMembers' : 'brideFamilyMembers';
    setCardDetails(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const removeFamilyMember = (side, index) => {
    const field = side === 'groom' ? 'groomFamilyMembers' : 'brideFamilyMembers';
    setCardDetails(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addEvent = () => {
    setCardDetails(prev => ({
      ...prev,
      events: [...prev.events, { eventName: '', eventDate: '', eventDay: '', eventTime: '', eventDescription: '' }]
    }));
  };

  const updateEvent = (index, field, value) => {
    setCardDetails(prev => ({
      ...prev,
      events: prev.events.map((event, i) => i === index ? { ...event, [field]: value } : event)
    }));
  };

  const removeEvent = (index) => {
    setCardDetails(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
  };

  const handleWhatsAppShare = () => {
    const text = `Check out this beautiful wedding card: ${product.title} - ₹${product.basePrice}/card`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const scrollSimilar = (direction) => {
    if (similarScrollRef.current) {
      similarScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-amber-50 px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading beautiful designs...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-amber-50 px-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">😕</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg text-sm sm:text-base">
            Explore Designs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-white to-amber-50/30">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 overflow-x-auto">
            <li><a href="/" className="hover:text-red-600 transition-colors whitespace-nowrap">Home</a></li>
            <li className="text-gray-300">/</li>
            <li><a href={`/category/${product.category}`} className="hover:text-red-600 transition-colors capitalize whitespace-nowrap">{product.category?.replace(/-/g, ' ')}</a></li>
            <li className="text-gray-300">/</li>
            <li className="text-red-600 font-medium truncate max-w-[120px] sm:max-w-[200px]">{product.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* IMAGE SECTION - Left Side on Desktop */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
            {/* Image Gallery Container */}
            <div className="flex flex-col-reverse lg:flex-row gap-3 lg:gap-4">
              
              {/* Vertical Thumbnails - Desktop Only */}
              <div className="hidden lg:flex flex-col gap-2 w-20 max-h-[500px] overflow-y-auto scrollbar-hide">
                {product.images?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-red-500 shadow-lg shadow-red-100 ring-2 ring-red-200' 
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <img src={getImageUrl(img.url)} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 relative">
                <div 
                  className="relative bg-white rounded-2xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-square cursor-zoom-in"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={getImageUrl(product.images?.[selectedImage]?.url)}
                    alt={product.title}
                    className={`w-full h-full object-contain transition-transform duration-300 ${isZoomed ? 'scale-150' : ''}`}
                    style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                  />
                  
                  {/* Discount Badge */}
                  {getDiscountPercent() > 0 && (
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                      {getDiscountPercent()}% OFF
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={handleToggleWishlist}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Navigation Arrows */}
                  {product.images?.length > 1 && (
                    <>
                      <button onClick={handlePrevImage} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button onClick={handleNextImage} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Counter - Mobile Only */}
                  <div className="lg:hidden absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs">
                    {selectedImage + 1} / {product.images?.length || 1}
                  </div>
                </div>

                {/* Horizontal Thumbnails - Mobile Only */}
                <div className="lg:hidden flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images?.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index 
                          ? 'border-red-500 shadow-md scale-105' 
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <img src={getImageUrl(img.url)} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS SECTION - Right Side on Desktop */}
          <div className="w-full lg:w-1/2 space-y-4 sm:space-y-5">
            {/* Title & Rating */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">{product.title}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                <div className="flex items-center gap-1">
                  {renderStars(reviewStats.averageRating || 0)}
                </div>
                {reviewStats.totalReviews > 0 && (
                  <>
                    <span className="text-yellow-600 font-semibold text-sm sm:text-base">
                      {reviewStats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 text-xs sm:text-sm">
                      {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </>
                )}
                {reviewStats.totalReviews > 0 && <span className="text-gray-300">|</span>}
                <span className="text-green-600 text-xs sm:text-sm font-medium">✓ In Stock</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-red-100">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-gray-800">₹{product.basePrice || 20}</span>
                <span className="text-gray-500 text-base sm:text-lg">/card</span>
                {product.originalPrice && product.originalPrice > product.basePrice && (
                  <span className="text-gray-400 line-through text-lg sm:text-xl">₹{product.originalPrice}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-amber-100 text-amber-700 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  🎉 Minimum Order: {product.minimumOrder || 100} cards
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-700 font-medium text-sm sm:text-base">Select Quantity</label>
                <span className="text-xs sm:text-sm text-gray-500">Min: {product.minimumOrder || 100} cards</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => setQuantity(Math.max(product.minimumOrder || 100, quantity - 50))}
                  disabled={quantity <= (product.minimumOrder || 100)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors ${
                    quantity <= (product.minimumOrder || 100) 
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-red-100 hover:text-red-500'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.minimumOrder || 100, parseInt(e.target.value) || (product.minimumOrder || 100)))}
                  className="w-20 sm:w-24 text-center text-lg sm:text-xl font-bold border-2 border-gray-200 rounded-lg py-2 focus:border-red-500 focus:outline-none"
                  min={product.minimumOrder || 100}
                  step="50"
                />
                <button 
                  onClick={() => setQuantity(quantity + 50)}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <span className="text-gray-500 text-sm sm:text-base">cards</span>
              </div>
              {/* Total Price Display */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-gray-600 text-sm">Total Price:</span>
                <span className="text-xl sm:text-2xl font-bold text-red-600">₹{(product.basePrice || 20) * quantity}</span>
              </div>
            </div>

         
            
            {/* Action Buttons - Like Reference Design */}
            <div className="flex gap-3 sm:gap-4">
              {/* Add to Cart Button - Blue Style */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 sm:py-4 bg-[#1E90FF] hover:bg-[#1873CC] text-white rounded-lg font-bold text-base sm:text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                style={{ color: '#FFFFFF' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-white">ADD TO CART</span>
              </button>

              {/* Buy Now Button - Orange Style */}
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 sm:py-4 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-lg font-bold text-base sm:text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                style={{ color: '#FFFFFF' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-white">BUY NOW</span>
              </button>
            </div>

            {/* WhatsApp Share Button */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3 sm:py-3.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              Share on WhatsApp
            </button>

            {/* Card Details Accordion */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleAccordion('cardDetails')}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 text-sm sm:text-base">Card Details</span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${openAccordions.cardDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordions.cardDetails && (
                <div className="p-3 sm:p-4 pt-0 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100">
                      <span className="text-gray-500">Card Size</span>
                      <span className="font-medium text-gray-800">8" x 8"</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100">
                      <span className="text-gray-500">Paper Type</span>
                      <span className="font-medium text-gray-800">Matte Art Card</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100">
                      <span className="text-gray-500">GSM</span>
                      <span className="font-medium text-gray-800">300 GSM</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100">
                      <span className="text-gray-500">Orientation</span>
                      <span className="font-medium text-gray-800">Square</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100">
                      <span className="text-gray-500">Printing</span>
                      <span className="font-medium text-gray-800">Both Sides</span>
                    </div>
                    <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100">
                      <span className="text-gray-500">Finish</span>
                      <span className="font-medium text-gray-800">Gold Foiling</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Package Includes Accordion */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleAccordion('packageIncludes')}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 text-sm sm:text-base">Package Includes</span>
                <svg className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${openAccordions.packageIncludes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openAccordions.packageIncludes && (
                <div className="p-3 sm:p-4 pt-0 border-t border-gray-100">
                  <ul className="space-y-1.5 sm:space-y-2">
                    <li className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Wedding Invitation Card
                    </li>
                    <li className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Matching Envelope
                    </li>
                    <li className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Insert Card (Events List)
                    </li>
                    <li className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ribbon Decoration (Optional +₹5/card)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Seller Info */}
            
          </div>
        </div>

        {/* Description & Reviews Section */}
        <div className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-red-600 border-b-2 border-red-500 text-sm sm:text-base">Description</button>
              <button className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-gray-500 hover:text-gray-700 text-sm sm:text-base">
                Reviews ({reviewStats.totalReviews})
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">Product Description</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {product.description || 'Celebrate your special day with our exquisite Hindu Wedding Invitation Card. Crafted with premium 300 GSM matte art card paper and adorned with elegant gold foiling, this card perfectly captures the essence of traditional Indian weddings while maintaining a modern aesthetic. Each card is meticulously designed to reflect the joy and grandeur of your wedding celebration.'}
            </p>
            
            {/* Reviews Section */}
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Customer Reviews</h3>
                {reviewStats.totalReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.round(reviewStats.averageRating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {reviewStats.averageRating.toFixed(1)} out of 5
                    </span>
                  </div>
                )}
              </div>

              {loadingReviews ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                  <p className="mt-2 text-gray-500">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to review this product!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {reviews.map((review) => (
                  <div key={review._id} className="border border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-400 to-amber-400 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                          {review.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-800 text-sm sm:text-base">{review.guestName}</h4>
                            {review.isVerifiedPurchase && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified Purchase</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">{review.comment}</p>
                    
                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={getImageUrl(img.url)}
                              alt={`Review ${idx + 1}`}
                              className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                              onClick={() => {
                                // Open image in modal or new tab
                                window.open(getImageUrl(img.url), '_blank');
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-8 sm:mt-12">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Similar Wedding Cards</h2>
              <div className="flex gap-2">
                <button onClick={() => scrollSimilar('left')} className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={() => scrollSimilar('right')} className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div ref={similarScrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth -mx-3 sm:-mx-4 px-3 sm:px-4">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item.slug}`)}
                  className="flex-shrink-0 w-44 sm:w-56 lg:w-64 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={getImageUrl(item.images?.[0]?.url)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-medium text-gray-800 truncate text-sm sm:text-base">{item.title}</h3>
                    <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                      <span className="text-base sm:text-lg font-bold text-red-600">₹{item.basePrice}/card</span>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        4.5
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Buy Now Modal - Wedding Card Details Form */}
      {showBuyNowModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            
            {/* Choice Screen - Show First */}
            {!orderMode && (
              <>
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🛒 How would you like to order?</h2>
                      <p className="text-sm text-gray-500 mt-1">Choose your preferred ordering method</p>
                    </div>
                    <button
                      onClick={() => setShowBuyNowModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Choice Options */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    
                    {/* Option 1: Contact Us */}
                    <div 
                      onClick={() => setOrderMode('contact')}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 sm:p-6 cursor-pointer hover:border-green-400 hover:shadow-lg transition-all group"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">📞 Contact Us for Details</h3>
                        <p className="text-sm text-gray-600 mb-4">Fast & Easy! Share details on call/WhatsApp</p>
                        
                        <div className="bg-white/60 rounded-xl p-3 text-left space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span> No forms to fill
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span> Direct call/WhatsApp support
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-green-500">✓</span> We'll collect details for you
                          </div>
                        </div>
                        
                        <div className="mt-4 py-2 px-4 bg-green-500 text-white rounded-full font-medium text-sm inline-block">
                          Quick & Easy →
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Fill Details Manually */}
                    <div 
                      onClick={() => setOrderMode('manual')}
                      className="bg-gradient-to-br from-red-50 to-amber-50 border-2 border-red-200 rounded-2xl p-5 sm:p-6 cursor-pointer hover:border-red-400 hover:shadow-lg transition-all group"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">📝 Fill Card Details Yourself</h3>
                        <p className="text-sm text-gray-600 mb-4">Complete control over your card content</p>
                        
                        <div className="bg-white/60 rounded-xl p-3 text-left space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-red-500">✓</span> Add all wedding details
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-red-500">✓</span> Multiple events & venues
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-red-500">✓</span> Family members list
                          </div>
                        </div>
                        
                        <div className="mt-4 py-2 px-4 bg-red-500 text-white rounded-full font-medium text-sm inline-block">
                          Self Customize →
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getImageUrl(product?.images?.[0]?.url)} 
                          alt={product?.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800 text-sm">{product?.title}</h4>
                          <p className="text-xs text-gray-500">{quantity} cards × ₹{product?.basePrice || 20}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">₹{(product?.basePrice || 20) * quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Option 1: Contact Us Form */}
            {orderMode === 'contact' && (
              <>
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOrderMode(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">📞 Contact Us for Details</h2>
                        <p className="text-sm text-gray-500 mt-1">We'll call you to collect card details</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBuyNowModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="p-4 sm:p-6">
                  <div className="max-w-md mx-auto space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={quickContact.fullName}
                        onChange={(e) => setQuickContact(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        value={quickContact.mobileNumber}
                        onChange={(e) => setQuickContact(prev => ({ ...prev, mobileNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                      <textarea
                        value={quickContact.message}
                        onChange={(e) => setQuickContact(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        rows={3}
                        placeholder="Any specific requirements or message..."
                      />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200 mt-6">
                      <h4 className="font-semibold text-green-800 mb-3 text-center">📲 Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleCallNow}
                          className="flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call Now
                        </button>
                        <button
                          onClick={handleWhatsAppChat}
                          className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                          </svg>
                          WhatsApp
                        </button>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2">🛒 Order Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Card:</span>
                          <span className="font-medium">{product?.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-medium">{quantity} cards</span>
                        </div>
                        <div className="flex justify-between border-t border-amber-200 pt-2 mt-2">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-amber-700">₹{(product?.basePrice || 20) * quantity}</span>
                        </div>
                      </div>
                      <p className="text-xs text-amber-600 mt-2 italic">📝 Order Note: Details will be shared on call</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6">
                  <button
                    onClick={handleQuickCheckout}
                    disabled={!quickContact.fullName || !quickContact.mobileNumber}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      quickContact.fullName && quickContact.mobileNumber
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    Proceed to Checkout - ₹{(product?.basePrice || 20) * quantity}
                  </button>
                </div>
              </>
            )}

            {/* Option 2: Manual Card Details Form */}
            {orderMode === 'manual' && (
              <>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setOrderMode(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      {getCardTypeInfo().title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {getCardTypeInfo().description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBuyNowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Step Indicator - Dynamic based on card type */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                {getCardType() === 'birthday' && ['Basic Info', 'Party Details', 'Theme & Photo', 'Contact'].map((step, index) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(index + 1)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeStep === index + 1
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    {step}
                  </button>
                ))}
                {getCardType() === 'anniversary' && ['Couple Info', 'Event Details', 'Host & Theme', 'Contact'].map((step, index) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(index + 1)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeStep === index + 1
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    {step}
                  </button>
                ))}
                {getCardType() === 'religious' && ['Event Info', 'Venue Details', 'Contact'].map((step, index) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(index + 1)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeStep === index + 1
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    {step}
                  </button>
                ))}
                {getCardType() === 'shopOpening' && ['Business Info', 'Event Details'].map((step, index) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(index + 1)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeStep === index + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    {step}
                  </button>
                ))}
                {getCardType() === 'wedding' && ['Groom', 'Bride', 'Host', 'Events', 'Venue', 'Contact'].map((step, index) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(index + 1)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeStep === index + 1
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              {/* Birthday Card Forms */}
              {getCardType() === 'birthday' && (
                <BirthdayCardForm 
                  activeStep={activeStep}
                  details={birthdayDetails}
                  updateDetails={updateBirthdayDetails}
                  quantity={quantity}
                  basePrice={product?.basePrice || 20}
                  handlePhotoUpload={handlePhotoUpload}
                />
              )}

              {/* Anniversary Card Forms */}
              {getCardType() === 'anniversary' && (
                <AnniversaryCardForm 
                  activeStep={activeStep}
                  details={anniversaryDetails}
                  updateDetails={updateAnniversaryDetails}
                  quantity={quantity}
                  basePrice={product?.basePrice || 20}
                  handlePhotoUpload={handlePhotoUpload}
                />
              )}

              {/* Religious Event Card Forms (Puja, Grih Pravesh, Satyanarayan Katha) */}
              {getCardType() === 'religious' && (
                <ReligiousEventCardForm 
                  activeStep={activeStep}
                  details={religiousDetails}
                  updateDetails={updateReligiousDetails}
                  quantity={quantity}
                  basePrice={product?.basePrice || 20}
                />
              )}

              {/* Visiting Card Form */}
              {getCardType() === 'visiting' && (
                <VisitingCardForm 
                  details={visitingCardDetails}
                  updateDetails={updateVisitingCardDetails}
                />
              )}

              {/* Letterhead Form */}
              {getCardType() === 'letterhead' && (
                <LetterheadForm 
                  details={letterheadDetails}
                  updateDetails={updateLetterheadDetails}
                />
              )}

              {/* Shop/Office Opening Form */}
              {getCardType() === 'shopOpening' && (
                <ShopOpeningCardForm 
                  activeStep={activeStep}
                  details={shopOpeningDetails}
                  updateDetails={updateShopOpeningDetails}
                />
              )}

              {/* Flex/Banner/Poster Form */}
              {getCardType() === 'flexBanner' && (
                <FlexBannerPosterForm 
                  details={flexBannerDetails}
                  updateDetails={updateFlexBannerDetails}
                />
              )}

              {/* Stickers & Labels Form */}
              {getCardType() === 'stickers' && (
                <StickersLabelsForm 
                  details={stickersLabelsDetails}
                  updateDetails={updateStickersLabelsDetails}
                />
              )}

              {/* Calendars & Diaries Form */}
              {getCardType() === 'calendars' && (
                <CalendarsDiariesForm 
                  details={calendarsDiariesDetails}
                  updateDetails={updateCalendarsDiariesDetails}
                />
              )}

              {/* Certificates & Awards Form */}
              {getCardType() === 'certificates' && (
                <CertificatesAwardsForm 
                  details={certificatesAwardsDetails}
                  updateDetails={updateCertificatesAwardsDetails}
                />
              )}

              {/* Condolence/Shraddh Form */}
              {getCardType() === 'condolence' && (
                <CondolenceShraddForm 
                  details={condolenceShraddDetails}
                  updateDetails={updateCondolenceShraddDetails}
                />
              )}

              {/* School/College Printing Form */}
              {getCardType() === 'schoolCollege' && (
                <SchoolCollegePrintingForm 
                  details={schoolCollegeDetails}
                  updateDetails={updateSchoolCollegeDetails}
                />
              )}

              {/* Personalized Gifts Form */}
              {getCardType() === 'gifts' && (
                <PersonalizedGiftsForm 
                  details={personalizedGiftsDetails}
                  updateDetails={updatePersonalizedGiftsDetails}
                />
              )}

              {/* Digital Invitations Form */}
              {getCardType() === 'digital' && (
                <DigitalInvitationsForm 
                  details={digitalInvitationsDetails}
                  updateDetails={updateDigitalInvitationsDetails}
                />
              )}

              {/* Wedding Card Forms (Original) */}
              {getCardType() === 'wedding' && (
                <>
              {/* Step 1: Groom Details */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">🤵</span> Groom (Dulha) Details
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Groom Full Name *</label>
                      <input
                        type="text"
                        value={cardDetails.groomFullName}
                        onChange={(e) => updateCardDetails('groomFullName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter groom's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Groom Father's Name *</label>
                      <input
                        type="text"
                        value={cardDetails.groomFatherName}
                        onChange={(e) => updateCardDetails('groomFatherName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter father's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Groom Mother's Name (optional)</label>
                      <input
                        type="text"
                        value={cardDetails.groomMotherName}
                        onChange={(e) => updateCardDetails('groomMotherName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter mother's name"
                      />
                    </div>
                  </div>

                  <h4 className="text-md font-medium text-gray-700 mt-4">Groom Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Village / City *</label>
                      <input
                        type="text"
                        value={cardDetails.groomVillageCity}
                        onChange={(e) => updateCardDetails('groomVillageCity', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Village or City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post / Area</label>
                      <input
                        type="text"
                        value={cardDetails.groomPostArea}
                        onChange={(e) => updateCardDetails('groomPostArea', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Post or Area"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                      <input
                        type="text"
                        value={cardDetails.groomDistrict}
                        onChange={(e) => updateCardDetails('groomDistrict', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="District"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        value={cardDetails.groomState}
                        onChange={(e) => updateCardDetails('groomState', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        value={cardDetails.groomPincode}
                        onChange={(e) => updateCardDetails('groomPincode', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Pincode"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  {/* Groom Family Members */}
                  <h4 className="text-md font-medium text-gray-700 mt-4">Family Members (Optional)</h4>
                  {cardDetails.groomFamilyMembers.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => updateFamilyMember('groom', index, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder={`Family member ${index + 1}`}
                      />
                      {cardDetails.groomFamilyMembers.length > 1 && (
                        <button
                          onClick={() => removeFamilyMember('groom', index)}
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addFamilyMember('groom')}
                    className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Family Member
                  </button>
                </div>
              )}

              {/* Step 2: Bride Details */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">👰</span> Bride (Dulhan) Details
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bride Full Name *</label>
                      <input
                        type="text"
                        value={cardDetails.brideFullName}
                        onChange={(e) => updateCardDetails('brideFullName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter bride's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bride Father's Name *</label>
                      <input
                        type="text"
                        value={cardDetails.brideFatherName}
                        onChange={(e) => updateCardDetails('brideFatherName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter father's name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bride Mother's Name (optional)</label>
                      <input
                        type="text"
                        value={cardDetails.brideMotherName}
                        onChange={(e) => updateCardDetails('brideMotherName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Enter mother's name"
                      />
                    </div>
                  </div>

                  <h4 className="text-md font-medium text-gray-700 mt-4">Bride Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Village / City *</label>
                      <input
                        type="text"
                        value={cardDetails.brideVillageCity}
                        onChange={(e) => updateCardDetails('brideVillageCity', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Village or City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post / Area</label>
                      <input
                        type="text"
                        value={cardDetails.bridePostArea}
                        onChange={(e) => updateCardDetails('bridePostArea', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Post or Area"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                      <input
                        type="text"
                        value={cardDetails.brideDistrict}
                        onChange={(e) => updateCardDetails('brideDistrict', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="District"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        value={cardDetails.brideState}
                        onChange={(e) => updateCardDetails('brideState', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        value={cardDetails.bridePincode}
                        onChange={(e) => updateCardDetails('bridePincode', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Pincode"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  {/* Bride Family Members */}
                  <h4 className="text-md font-medium text-gray-700 mt-4">Family Members (Optional)</h4>
                  {cardDetails.brideFamilyMembers.map((member, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) => updateFamilyMember('bride', index, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder={`Family member ${index + 1}`}
                      />
                      {cardDetails.brideFamilyMembers.length > 1 && (
                        <button
                          onClick={() => removeFamilyMember('bride', index)}
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addFamilyMember('bride')}
                    className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Family Member
                  </button>
                </div>
              )}

              {/* Step 3: Host & Invitation Details */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">👪</span> Host / Inviter Details
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invited by (Family Name / Head Name) *</label>
                    <input
                      type="text"
                      value={cardDetails.invitedBy}
                      onChange={(e) => updateCardDetails('invitedBy', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="e.g., श्री राम प्रसाद शर्मा एवं परिवार"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Line (editable text)</label>
                    <textarea
                      value={cardDetails.invitationLine}
                      onChange={(e) => updateCardDetails('invitationLine', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                      placeholder="आपको सपरिवार शुभ विवाह में सादर आमंत्रित करते हैं"
                    />
                    <p className="text-xs text-gray-500 mt-1">Example: "आपको सपरिवार शुभ विवाह में सादर आमंत्रित करते हैं"</p>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-800 mb-2">💡 Card Language</h4>
                    <div className="flex flex-wrap gap-3">
                      {['hindi', 'english', 'hinglish'].map((lang) => (
                        <label key={lang} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="cardLanguage"
                            value={lang}
                            checked={cardDetails.cardLanguage === lang}
                            onChange={(e) => updateCardDetails('cardLanguage', e.target.value)}
                            className="w-4 h-4 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-gray-700 capitalize">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Message / Note (Optional)</label>
                    <textarea
                      value={cardDetails.specialMessage}
                      onChange={(e) => updateCardDetails('specialMessage', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Any special message for guests..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Instructions (Optional)</label>
                    <textarea
                      value={cardDetails.guestInstructions}
                      onChange={(e) => updateCardDetails('guestInstructions', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={2}
                      placeholder="Time, location changes, dress code, etc..."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Wedding Events */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">🎊</span> Wedding Events & Schedule
                  </h3>

                  {/* Main Wedding */}
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3">💒 Shubh Vivah (Main Wedding)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date *</label>
                        <input
                          type="date"
                          value={cardDetails.weddingDate}
                          onChange={(e) => updateCardDetails('weddingDate', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Day</label>
                        <input
                          type="text"
                          value={cardDetails.weddingDay}
                          onChange={(e) => updateCardDetails('weddingDay', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., Sunday / रविवार"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Muhurat / Time *</label>
                        <input
                          type="time"
                          value={cardDetails.weddingMuhurat}
                          onChange={(e) => updateCardDetails('weddingMuhurat', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Samvat / Year (Optional)</label>
                        <input
                          type="text"
                          value={cardDetails.samvat}
                          onChange={(e) => updateCardDetails('samvat', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="e.g., विक्रम संवत 2082"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Other Events */}
                  <h4 className="font-medium text-gray-700">Other Events (Haldi, Mehendi, Sangeet, etc.)</h4>
                  {cardDetails.events.map((event, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-700">Event {index + 1}</span>
                        {cardDetails.events.length > 1 && (
                          <button
                            onClick={() => removeEvent(index)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                          <select
                            value={event.eventName}
                            onChange={(e) => updateEvent(index, 'eventName', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            <option value="">Select Event</option>
                            <option value="Haldi">Haldi / हल्दी</option>
                            <option value="Mehendi">Mehendi / मेहंदी</option>
                            <option value="Sangeet">Sangeet / संगीत</option>
                            <option value="Baraat">Baraat / बारात</option>
                            <option value="Tilak">Tilak / तिलक</option>
                            <option value="Reception">Reception / रिसेप्शन</option>
                            <option value="Other">Other / अन्य</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                          <input
                            type="date"
                            value={event.eventDate}
                            onChange={(e) => updateEvent(index, 'eventDate', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
                          <input
                            type="time"
                            value={event.eventTime}
                            onChange={(e) => updateEvent(index, 'eventTime', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                          <input
                            type="text"
                            value={event.eventDescription}
                            onChange={(e) => updateEvent(index, 'eventDescription', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="Any special note..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEvent}
                    className="text-red-500 text-sm font-medium hover:text-red-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Another Event
                  </button>
                </div>
              )}

              {/* Step 5: Venue Details */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">🏛️</span> Venue Details
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
                      <input
                        type="text"
                        value={cardDetails.venueName}
                        onChange={(e) => updateCardDetails('venueName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="e.g., Hotel Taj Palace / राजमहल बैंक्वेट हॉल"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                      <textarea
                        value={cardDetails.venueFullAddress}
                        onChange={(e) => updateCardDetails('venueFullAddress', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows={2}
                        placeholder="Complete venue address..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City / District *</label>
                      <input
                        type="text"
                        value={cardDetails.venueCity}
                        onChange={(e) => updateCardDetails('venueCity', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        value={cardDetails.venueState}
                        onChange={(e) => updateCardDetails('venueState', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        value={cardDetails.venuePincode}
                        onChange={(e) => updateCardDetails('venuePincode', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Pincode"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        value={cardDetails.venueLandmark}
                        onChange={(e) => updateCardDetails('venueLandmark', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Near..."
                      />
                    </div>
                  </div>

                  {/* Reception */}
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mt-6">
                    <h4 className="font-semibold text-purple-800 mb-3">🎉 Reception / Aashirwad (Optional)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reception Date</label>
                        <input
                          type="date"
                          value={cardDetails.receptionDate}
                          onChange={(e) => updateCardDetails('receptionDate', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reception Time</label>
                        <input
                          type="time"
                          value={cardDetails.receptionTime}
                          onChange={(e) => updateCardDetails('receptionTime', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reception Venue</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="receptionVenue"
                              value="same"
                              checked={cardDetails.receptionVenue === 'same'}
                              onChange={(e) => updateCardDetails('receptionVenue', e.target.value)}
                              className="w-4 h-4 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-gray-700">Same as Wedding</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="receptionVenue"
                              value="different"
                              checked={cardDetails.receptionVenue === 'different'}
                              onChange={(e) => updateCardDetails('receptionVenue', e.target.value)}
                              className="w-4 h-4 text-red-500 focus:ring-red-500"
                            />
                            <span className="text-gray-700">Different Venue</span>
                          </label>
                        </div>
                      </div>
                      {cardDetails.receptionVenue === 'different' && (
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reception Venue Address</label>
                          <textarea
                            value={cardDetails.receptionVenueAddress}
                            onChange={(e) => updateCardDetails('receptionVenueAddress', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            rows={2}
                            placeholder="Different venue address..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Contact Details */}
              {activeStep === 6 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📞</span> Contact / RSVP Details
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
                      <input
                        type="text"
                        value={cardDetails.contactPersonName}
                        onChange={(e) => updateCardDetails('contactPersonName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Contact person name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        value={cardDetails.mobileNumber}
                        onChange={(e) => updateCardDetails('mobileNumber', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number (Optional)</label>
                      <input
                        type="tel"
                        value={cardDetails.alternateNumber}
                        onChange={(e) => updateCardDetails('alternateNumber', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="Alternate number"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6">
                    <h4 className="font-semibold text-green-800 mb-3">🛒 Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Card:</span>
                        <span className="font-medium">{product?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{quantity} cards</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per card:</span>
                        <span className="font-medium">₹{product?.basePrice || 20}</span>
                      </div>
                      <div className="flex justify-between border-t border-green-200 pt-2 mt-2">
                        <span className="font-semibold text-gray-800">Total Amount:</span>
                        <span className="font-bold text-green-700 text-lg">₹{(product?.basePrice || 20) * quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : setShowBuyNowModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {activeStep > 1 ? '← Previous' : 'Back'}
                </button>
                
                {activeStep < (
                  getCardType() === 'visiting' || getCardType() === 'letterhead' ? 1 : 
                  getCardType() === 'shopOpening' ? 2 : 
                  getCardType() === 'religious' ? 3 : 
                  getCardType() === 'birthday' || getCardType() === 'anniversary' ? 4 : 6
                ) ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className={`px-6 py-3 ${
                      getCardType() === 'birthday' ? 'bg-pink-500 hover:bg-pink-600' : 
                      getCardType() === 'anniversary' ? 'bg-purple-500 hover:bg-purple-600' : 
                      getCardType() === 'religious' ? 'bg-orange-500 hover:bg-orange-600' : 
                      getCardType() === 'visiting' ? 'bg-teal-500 hover:bg-teal-600' :
                      getCardType() === 'letterhead' ? 'bg-indigo-500 hover:bg-indigo-600' :
                      getCardType() === 'shopOpening' ? 'bg-blue-500 hover:bg-blue-600' :
                      'bg-red-500 hover:bg-red-600'
                    } text-white rounded-lg font-medium transition-colors`}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={handleSaveDetails}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Pay Now - ₹{(product?.basePrice || 20) * quantity}
                  </button>
                )}
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;

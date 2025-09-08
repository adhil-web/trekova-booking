document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('confirmationForm');

    // Form inputs
    const clientNameInput = form.clientName;
    const contactNumberInput = form.contactNumber;
    const checkInInput = form.checkIn;
    const checkOutInput = form.checkOut;
    const adultsInput = form.adults;
    const childrenInput = form.children;
    const standardRoomsInput = form.standardRooms;
    const executiveRoomsInput = form.executiveRooms;
    const premiumRoomsInput = form.premiumRooms;
    const suiteRoomsInput = form.suiteRooms;
    const fullPropertyInput = form.fullProperty;
    const totalRoomsInput = form.totalRooms;
    const planTypeInput = form.planType;
    const totalAmountInput = form.totalAmount;
    const advancePaidInput = form.advancePaid;
    const balanceAmountInput = form.balanceAmount;

    // Preview elements
    const previewClientName = document.getElementById('previewClientName');
    const previewContactNumber = document.getElementById('previewContactNumber');
    const previewCheckIn = document.getElementById('previewCheckIn');
    const previewCheckOut = document.getElementById('previewCheckOut');
    const previewName = document.getElementById('previewName');
    const previewMembers = document.getElementById('previewMembers');
    const previewRoomType = document.getElementById('previewRoomType');
    const previewPlanType = document.getElementById('previewPlanType');
    const previewTotalRooms = document.getElementById('previewTotalRooms');
    const previewTotalAmount = document.getElementById('previewTotalAmount');
    const previewAdvancePaid = document.getElementById('previewAdvancePaid');
    const previewBalanceAmount = document.getElementById('previewBalanceAmount');

    // Constants
    const FULL_PROPERTY_ROOM_COUNT = 10;

    // Update total rooms based on inputs
    function updateTotalRooms() {
        if (fullPropertyInput.checked) {
            totalRoomsInput.value = FULL_PROPERTY_ROOM_COUNT;
        } else {
            const total =
                Number(standardRoomsInput.value) +
                Number(executiveRoomsInput.value) +
                Number(premiumRoomsInput.value) +
                Number(suiteRoomsInput.value);
            totalRoomsInput.value = total;
        }
    }

    // Update balance amount
    function updateBalanceAmount() {
        const total = parseFloat(totalAmountInput.value) || 0;
        const advance = parseFloat(advancePaidInput.value) || 0;
        const balance = total - advance;
        balanceAmountInput.value = balance >= 0 ? balance.toFixed(2) : '0.00';
    }

    // Format date and time for preview
    function formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return '________________________';
        const date = new Date(dateTimeStr);
        if (isNaN(date)) return '________________________';
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }

    // Update preview content
    function updatePreview() {
        previewClientName.textContent = clientNameInput.value || '__________';
        previewContactNumber.textContent = contactNumberInput.value || '________________________';
        previewCheckIn.textContent = formatDateTime(checkInInput.value);
        previewCheckOut.textContent = formatDateTime(checkOutInput.value);
        previewName.textContent = clientNameInput.value || '________________________';

        // Number of persons preview
        const adults = Number(adultsInput.value);
        const children = Number(childrenInput.value);
        let membersText = '';
        if (adults > 0) membersText += adults + (adults === 1 ? ' Adult' : ' Adults');
        if (children > 0) {
            if (membersText) membersText += ', ';
            membersText += children + (children === 1 ? ' Child' : ' Children');
        }
        previewMembers.textContent = membersText || '________________________';

        // Room type preview
        if (fullPropertyInput.checked) {
            previewRoomType.textContent = 'Full Property';
        } else {
            const rooms = [];
            if (Number(standardRoomsInput.value) > 0) rooms.push(`${standardRoomsInput.value} Standard Room${standardRoomsInput.value > 1 ? 's' : ''}`);
            if (Number(executiveRoomsInput.value) > 0) rooms.push(`${executiveRoomsInput.value} Trekova Executive Room${executiveRoomsInput.value > 1 ? 's' : ''}`);
            if (Number(premiumRoomsInput.value) > 0) rooms.push(`${premiumRoomsInput.value} Trekova Premium View Room${premiumRoomsInput.value > 1 ? 's' : ''}`);
            if (Number(suiteRoomsInput.value) > 0) rooms.push(`${suiteRoomsInput.value} Trekova Suite Room${suiteRoomsInput.value > 1 ? 's' : ''}`);
            previewRoomType.textContent = rooms.length > 0 ? rooms.join(', ') : '________________________';
        }

        previewPlanType.textContent = planTypeInput.value || '________________________';
        previewTotalRooms.textContent = totalRoomsInput.value || '________________________';
        previewTotalAmount.textContent = totalAmountInput.value ? `₹${parseFloat(totalAmountInput.value).toFixed(2)}` : '________________________';
        previewAdvancePaid.textContent = advancePaidInput.value ? `₹${parseFloat(advancePaidInput.value).toFixed(2)}` : '________________________';
        previewBalanceAmount.textContent = balanceAmountInput.value ? `₹${parseFloat(balanceAmountInput.value).toFixed(2)}` : '________________________';
    }

    // Event listeners for inputs to update preview and calculations
    [
        clientNameInput,
        contactNumberInput,
        checkInInput,
        checkOutInput,
        adultsInput,
        childrenInput,
        standardRoomsInput,
        executiveRoomsInput,
        premiumRoomsInput,
        suiteRoomsInput,
        fullPropertyInput,
        planTypeInput,
        totalAmountInput,
        advancePaidInput,
    ].forEach(input => {
        input.addEventListener('input', () => {
            updateTotalRooms();
            updateBalanceAmount();
            updatePreview();
        });
    });

    // Also update on checkbox change
    fullPropertyInput.addEventListener('change', () => {
        updateTotalRooms();
        updatePreview();
    });

    // Initialize preview and calculations on page load
    updateTotalRooms();
    updateBalanceAmount();
    updatePreview();

    // Generate PDF button
    document.getElementById('generatePdf').addEventListener('click', () => {
        const container = document.querySelector('.container');
        const element = document.getElementById('confirmationPreview');

        // Apply PDF generation styles
        container.classList.add('pdf-generation');

        // Wait for images to load and ensure all content is ready
        const images = element.querySelectorAll('img');
        let imagesLoaded = 0;

        if (images.length === 0) {
            // No images, proceed immediately
            generatePDF();
        } else {
            // Wait for all images to load
            images.forEach(img => {
                if (img.complete) {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        generatePDF();
                    }
                } else {
                    img.onload = () => {
                        imagesLoaded++;
                        if (imagesLoaded === images.length) {
                            generatePDF();
                        }
                    };
                    img.onerror = () => {
                        imagesLoaded++;
                        if (imagesLoaded === images.length) {
                            generatePDF();
                        }
                    };
                }
            });
        }

        function generatePDF() {
            setTimeout(() => {
                const opt = {
                    margin:       [0.25, 0.25, 0.25, 0.25], // further reduced margins for better alignment
                    filename:     `BOOKING CONFIRMATION_${clientNameInput.value || 'Guest'}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  {
                        scale: 2, // optimal scale for text clarity
                        useCORS: true,
                        allowTaint: true,
                        scrollX: 0,
                        scrollY: 0,
                        backgroundColor: '#ffffff'
                    },
                    jsPDF:        {
                        unit: 'in',
                        format: 'a4',
                        orientation: 'portrait',
                        compress: true
                    }
                };

                html2pdf().set(opt).from(element).save().then(() => {
                    // Remove PDF generation styles after PDF is generated
                    container.classList.remove('pdf-generation');
                });
            }, 500); // Shorter delay since images are already loaded
        }
    });

    // Send via WhatsApp button
    document.getElementById('sendWhatsapp').addEventListener('click', () => {
        // Compose message text similar to preview content
        const adults = Number(adultsInput.value);
        const children = Number(childrenInput.value);
        let membersText = '';
        if (adults > 0) membersText += adults + (adults === 1 ? ' Adult' : ' Adults');
        if (children > 0) {
            if (membersText) membersText += ', ';
            membersText += children + (children === 1 ? ' Child' : ' Children');
        }
        if (!membersText) membersText = 'N/A';

        let roomTypeText = '';
        if (fullPropertyInput.checked) {
            roomTypeText = 'Full Property';
        } else {
            const rooms = [];
            if (Number(standardRoomsInput.value) > 0) rooms.push(`${standardRoomsInput.value} Standard Room${standardRoomsInput.value > 1 ? 's' : ''}`);
            if (Number(executiveRoomsInput.value) > 0) rooms.push(`${executiveRoomsInput.value} Trekova Executive Room${executiveRoomsInput.value > 1 ? 's' : ''}`);
            if (Number(premiumRoomsInput.value) > 0) rooms.push(`${premiumRoomsInput.value} Trekova Premium View Room${premiumRoomsInput.value > 1 ? 's' : ''}`);
            if (Number(suiteRoomsInput.value) > 0) rooms.push(`${suiteRoomsInput.value} Trekova Suite Room${suiteRoomsInput.value > 1 ? 's' : ''}`);
            roomTypeText = rooms.length > 0 ? rooms.join(', ') : 'N/A';
        }

        const message = 
`Hotel Confirmation Letter

Dear ${clientNameInput.value || 'Guest'},

I am pleased to confirm your reservation at TREKOVA SUITES for your upcoming stay. We highly appreciate your choice to stay with us and are delighted to accommodate you.

Your Hotel Confirmation Details:
- Check-in Date & Time: ${formatDateTime(checkInInput.value)}
- Check-out Date & Time: ${formatDateTime(checkOutInput.value)}
- Contact Number: ${contactNumberInput.value || 'N/A'}
- Name: ${clientNameInput.value || 'N/A'}
- No. of Members: ${membersText}
- Room Type: ${roomTypeText}
- Plan: ${planTypeInput.value || 'N/A'}

Payment Details:
- Total Amount: ₹${totalAmountInput.value || '0.00'}
- Advance Paid: ₹${advancePaidInput.value || '0.00'}
- Balance Amount: ₹${balanceAmountInput.value || '0.00'}

We look forward to welcoming you to TREKOVA SUITES soon. If you have any further inquiries or need to make changes to your reservation, please do not hesitate to contact us.

Contact Numbers:
+91 9847463098
+91 7306474213

NOTE: Balance should be payed at the time of check in`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    });

    // Send PDF via WhatsApp button
    document.getElementById('sendPdfWhatsapp').addEventListener('click', () => {
        const clientNumber = contactNumberInput.value.trim();
        if (!clientNumber) {
            alert('Please enter a valid client contact number.');
            return;
        }

        // Clean the phone number (remove spaces, dashes, etc.)
        const cleanNumber = clientNumber.replace(/\D/g, '');

        // Apply PDF generation styles
        const container = document.querySelector('.container');
        container.classList.add('pdf-generation');

        // Wait for images to load and ensure all content is ready
        const element = document.getElementById('confirmationPreview');
        const images = element.querySelectorAll('img');
        let imagesLoaded = 0;

        if (images.length === 0) {
            // No images, proceed immediately
            generateWhatsAppPDF();
        } else {
            // Wait for all images to load
            images.forEach(img => {
                if (img.complete) {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        generateWhatsAppPDF();
                    }
                } else {
                    img.onload = () => {
                        imagesLoaded++;
                        if (imagesLoaded === images.length) {
                            generateWhatsAppPDF();
                        }
                    };
                    img.onerror = () => {
                        imagesLoaded++;
                        if (imagesLoaded === images.length) {
                            generateWhatsAppPDF();
                        }
                    };
                }
            });
        }

        function generateWhatsAppPDF() {
            setTimeout(() => {
                const opt = {
                    margin:       [0.25, 0.25, 0.25, 0.25], // further reduced margins for better alignment
                    filename:     `BOOKING CONFIRMATION_${clientNameInput.value || 'Guest'}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  {
                        scale: 2, // optimal scale for text clarity
                        useCORS: true,
                        allowTaint: true,
                        scrollX: 0,
                        scrollY: 0,
                        backgroundColor: '#ffffff'
                    },
                    jsPDF:        {
                        unit: 'in',
                        format: 'a4',
                        orientation: 'portrait',
                        compress: true
                    }
                };

                html2pdf().set(opt).from(element).outputPdf('blob').then((pdfBlob) => {
                    // Try to use Web Share API if available (mobile devices)
                    if (navigator.share && navigator.canShare) {
                        const file = new File([pdfBlob], `BOOKING CONFIRMATION_${clientNameInput.value || 'Guest'}.pdf`, { type: 'application/pdf' });
                        if (navigator.canShare({ files: [file] })) {
                            navigator.share({
                                title: 'Hotel Booking Confirmation',
                                text: `Please find attached the booking confirmation for ${clientNameInput.value || 'Guest'}`,
                                files: [file]
                            }).catch(() => {
                                // Fall back to WhatsApp message
                                openWhatsAppWithMessage(cleanNumber);
                            });
                        } else {
                            openWhatsAppWithMessage(cleanNumber);
                        }
                    } else {
                        // Fall back to WhatsApp message with instructions
                        openWhatsAppWithMessage(cleanNumber);
                    }

                    // Remove PDF generation styles after PDF is generated
                    container.classList.remove('pdf-generation');
                });
            }, 500); // Shorter delay since images are already loaded
        }
    });

    // Helper function to open WhatsApp with message
    function openWhatsAppWithMessage(phoneNumber) {
        const message = `Dear ${clientNameInput.value || 'Guest'},

Please find attached your hotel booking confirmation PDF.

*TREKOVA SUITES*
Booking Confirmation Details:
- Name: ${clientNameInput.value || 'N/A'}
- Check-in: ${formatDateTime(checkInInput.value)}
- Check-out: ${formatDateTime(checkOutInput.value)}

For any queries, contact us at:
📞 +91 9847463098
📞 +91 7306474213
📧 info@trekova.in

Thank you for choosing TREKOVA SUITES!`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }
});

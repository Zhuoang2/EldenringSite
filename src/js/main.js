document.addEventListener('DOMContentLoaded', function() {
    // Existing variables and functions
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const next = document.querySelector('.next');
    const prev = document.querySelector('.prev');

    // Get all columns and modals
    const columns = document.querySelectorAll('.column');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    // Function to open a modal
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    };

    // Function to close a modal
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Open modal when a column is clicked
    columns.forEach((column) => {
        column.addEventListener('click', function () {
            const columnId = column.id;
            const modalId = `modal-${columnId}`;
            openModal(modalId);
        });
    });

    // Close modal when the close button is clicked
    closeButtons.forEach((closeButton) => {
        closeButton.addEventListener('click', function () {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function (event) {
        modals.forEach((modal) => {
            if (event.target == modal) {
                closeModal(modal.id);
            }
        });
    });

    window.addEventListener('load', function() {
        // Check if the URL contains a hash (e.g., #contact)
        if (window.location.hash) {
            // Scroll to the top of the page
            window.scrollTo(0, 0);

            // Use history.replaceState() to remove the hash from the URL
            history.replaceState(null, null, window.location.pathname);
        }
    });

    // Carousel functionality
    function showSlide(index) {
        // Adjust the index to loop around if out of bounds
        if (index >= slides.length) {
            index = 0;
        } else if (index < 0) {
            index = slides.length - 1;
        }

        // Hide all slides and show the current one
        slides.forEach(slide => slide.style.display = 'none');
        slides[index].style.display = 'block';

        // Update the slideIndex
        slideIndex = index;
    }

    // Initialize the carousel
    showSlide(slideIndex);

    // Attach event listeners to the next and prev buttons
    if (next) {
        next.addEventListener('click', () => {
            showSlide(slideIndex + 1);
        });
    }

    if (prev) {
        prev.addEventListener('click', () => {
            showSlide(slideIndex - 1);
        });
    }

    // Smooth Scrolling Function
    function smoothScroll(target, duration) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        const navHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Ensure we land exactly at the target position
                window.scrollTo(0, targetPosition);

                // Accessibility: Set focus to the target element
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        }

        function easeInOutQuad(t, b, c, d) {
            // Easing function
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Event Listener for Navigation Links
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('#navbar ul li a');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link'); // Select navigation links

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
                observer.unobserve(entry.target); // Optional: Stop observing after animation
            }
        });
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Attach click event to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target, 10000); // Adjust duration as needed
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
    
        // Loop over sections from bottom to top
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const sectionTop = section.offsetTop - 200;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
                break;
            }
        }
    
        // Update the active class on navbar items
        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) {
                a.classList.add('active');
            }
        });
    
        // Toggle between large and small navbar
        if (window.scrollY > 50) {
            navbar.classList.remove('large');
            navbar.classList.add('small');
        } else {
            navbar.classList.remove('small');
            navbar.classList.add('large');
        }
    });
    

    // Modal functionality for columns
    // Define column IDs and modal IDs
    const modalMapping = {
        story: 'modal-story',
        gameplay: 'modal-gameplay',
        multiplayer: 'modal-multiplayer',
        exploration: 'modal-exploration',
        characterDevelopment: 'modal-character-development',
        bossBattles: 'modal-boss-battles'
    };

    // Add click event listeners to open modals
    Object.keys(modalMapping).forEach(columnId => {
        const columnElement = document.getElementById(columnId);
        const modalElement = document.getElementById(modalMapping[columnId]);

        // Open modal on column click
        if (columnElement && modalElement) {
            columnElement.addEventListener('click', function() {
                modalElement.style.display = 'block';
            });

            // Close modal on close button click
            const closeButton = modalElement.querySelector('.close');
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    modalElement.style.display = 'none';
                });
            }

            // Close modal if clicked outside of modal content
            window.addEventListener('click', function(event) {
                if (event.target === modalElement) {
                    modalElement.style.display = 'none';
                }
            });
        }
    });

    
});

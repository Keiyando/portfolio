/**
 * Contact Form Module
 * Handles form validation, submission, and user feedback
 */
const ContactForm = (() => {
    'use strict';
    
    // Configuration
    const config = {
        minNameLength: 2,
        minMessageLength: 10,
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        submitDelay: 2000, // Simulated submission delay
        formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID' // Replace with actual endpoint
    };
    
    // State
    let isSubmitting = false;
    let formElement = null;
    let honeypotField = null;
    
    /**
     * Initialize the contact form
     */
    function init() {
        formElement = document.querySelector('.contact-form');
        if (!formElement) return;
        
        // Add honeypot field for spam protection
        createHoneypot();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup form fields
        setupFormFields();
        
        console.log('Contact form initialized');
    }
    
    /**
     * Create honeypot field for spam protection
     */
    function createHoneypot() {
        honeypotField = document.createElement('input');
        honeypotField.type = 'text';
        honeypotField.name = '_gotcha';
        honeypotField.tabIndex = -1;
        honeypotField.autocomplete = 'off';
        honeypotField.setAttribute('aria-hidden', 'true');
        honeypotField.style.position = 'absolute';
        honeypotField.style.left = '-9999px';
        formElement.appendChild(honeypotField);
    }
    
    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Form submission
        formElement.addEventListener('submit', handleSubmit);
        
        // Real-time validation
        const inputs = formElement.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => validateField(input));
            
            // Clear error on input
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    clearError(input);
                }
            });
            
            // Prevent paste in honeypot
            if (input === honeypotField) {
                input.addEventListener('paste', e => e.preventDefault());
            }
        });
        
        // Reset button
        const resetButton = formElement.querySelector('.btn-reset');
        if (resetButton) {
            resetButton.addEventListener('click', handleReset);
        }
    }
    
    /**
     * Setup form fields with proper attributes
     */
    function setupFormFields() {
        // Add placeholders and ARIA attributes
        const nameInput = formElement.querySelector('#contact-name');
        if (nameInput) {
            nameInput.setAttribute('placeholder', '山田 太郎');
            nameInput.setAttribute('minlength', config.minNameLength);
        }
        
        const emailInput = formElement.querySelector('#contact-email');
        if (emailInput) {
            emailInput.setAttribute('placeholder', 'example@email.com');
        }
        
        const subjectInput = formElement.querySelector('#contact-subject');
        if (subjectInput) {
            subjectInput.setAttribute('placeholder', 'お問い合わせの件名');
        }
        
        const messageInput = formElement.querySelector('#contact-message');
        if (messageInput) {
            messageInput.setAttribute('placeholder', 'お問い合わせ内容をご記入ください');
            messageInput.setAttribute('minlength', config.minMessageLength);
        }
    }
    
    /**
     * Handle form submission
     */
    async function handleSubmit(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Check honeypot
        if (honeypotField && honeypotField.value) {
            console.warn('Honeypot triggered - possible spam');
            return;
        }
        
        // Validate all fields
        const isValid = validateForm();
        if (!isValid) {
            focusFirstError();
            return;
        }
        
        // Start submission
        isSubmitting = true;
        showLoadingState();
        
        try {
            // Prepare form data
            const formData = new FormData(formElement);
            formData.delete('_gotcha'); // Remove honeypot from submission
            
            // Submit form (simulate for now, replace with actual endpoint)
            const response = await submitForm(formData);
            
            if (response.ok) {
                showSuccessMessage();
                resetForm();
            } else {
                showErrorMessage('送信に失敗しました。もう一度お試しください。');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage('ネットワークエラーが発生しました。後ほどお試しください。');
        } finally {
            isSubmitting = false;
            hideLoadingState();
        }
    }
    
    /**
     * Submit form data
     */
    async function submitForm(formData) {
        // Simulate submission for development
        // Replace with actual Formspree or other service endpoint
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Development mode - simulate submission
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Form data:', Object.fromEntries(formData));
                    resolve({ ok: true });
                }, config.submitDelay);
            });
        }
        
        // Production mode - actual submission
        return fetch(config.formspreeEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
    }
    
    /**
     * Validate entire form
     */
    function validateForm() {
        const inputs = formElement.querySelectorAll('.form-input, .form-textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    /**
     * Validate individual field
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Check required fields
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'このフィールドは必須です';
            isValid = false;
        }
        // Validate name
        else if (fieldName === 'name' && value) {
            if (value.length < config.minNameLength) {
                errorMessage = `お名前は${config.minNameLength}文字以上で入力してください`;
                isValid = false;
            }
        }
        // Validate email
        else if (fieldName === 'email' && value) {
            if (!config.emailRegex.test(value)) {
                errorMessage = '有効なメールアドレスを入力してください';
                isValid = false;
            }
        }
        // Validate message
        else if (fieldName === 'message' && value) {
            if (value.length < config.minMessageLength) {
                errorMessage = `メッセージは${config.minMessageLength}文字以上で入力してください`;
                isValid = false;
            }
        }
        
        // Show or clear error
        if (!isValid) {
            showError(field, errorMessage);
        } else {
            clearError(field);
        }
        
        return isValid;
    }
    
    /**
     * Show error for a field
     */
    function showError(field, message) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    /**
     * Clear error for a field
     */
    function clearError(field) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        
        const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    /**
     * Focus first field with error
     */
    function focusFirstError() {
        const firstError = formElement.querySelector('.error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    /**
     * Show loading state
     */
    function showLoadingState() {
        const submitButton = formElement.querySelector('.btn-submit');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner"></span> 送信中...';
            submitButton.classList.add('loading');
        }
        
        // Disable all inputs
        const inputs = formElement.querySelectorAll('input, textarea, button');
        inputs.forEach(input => input.disabled = true);
    }
    
    /**
     * Hide loading state
     */
    function hideLoadingState() {
        const submitButton = formElement.querySelector('.btn-submit');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '送信する';
            submitButton.classList.remove('loading');
        }
        
        // Enable all inputs except honeypot
        const inputs = formElement.querySelectorAll('input, textarea, button');
        inputs.forEach(input => {
            if (input !== honeypotField) {
                input.disabled = false;
            }
        });
    }
    
    /**
     * Show success message
     */
    function showSuccessMessage() {
        const messageContainer = createMessageContainer();
        messageContainer.className = 'form-message success';
        messageContainer.innerHTML = `
            <div class="message-content">
                <svg class="message-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <div class="message-text">
                    <h3>送信完了</h3>
                    <p>お問い合わせありがとうございます。<br>内容を確認後、ご連絡させていただきます。</p>
                </div>
            </div>
        `;
        
        showMessage(messageContainer);
    }
    
    /**
     * Show error message
     */
    function showErrorMessage(message) {
        const messageContainer = createMessageContainer();
        messageContainer.className = 'form-message error';
        messageContainer.innerHTML = `
            <div class="message-content">
                <svg class="message-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div class="message-text">
                    <h3>送信エラー</h3>
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        showMessage(messageContainer);
    }
    
    /**
     * Create message container
     */
    function createMessageContainer() {
        let container = document.querySelector('.form-message');
        if (!container) {
            container = document.createElement('div');
            container.className = 'form-message';
            formElement.parentNode.insertBefore(container, formElement);
        }
        return container;
    }
    
    /**
     * Show message with animation
     */
    function showMessage(messageElement) {
        messageElement.style.display = 'block';
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // Auto-hide after 5 seconds for error messages
        if (messageElement.classList.contains('error')) {
            setTimeout(() => {
                hideMessage(messageElement);
            }, 5000);
        }
    }
    
    /**
     * Hide message
     */
    function hideMessage(messageElement) {
        messageElement.classList.remove('show');
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 300);
    }
    
    /**
     * Reset form
     */
    function resetForm() {
        formElement.reset();
        
        // Clear all errors
        const inputs = formElement.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => clearError(input));
    }
    
    /**
     * Handle reset button
     */
    function handleReset(e) {
        e.preventDefault();
        
        if (confirm('フォームの内容をクリアしてもよろしいですか？')) {
            resetForm();
        }
    }
    
    // Public API
    return {
        init,
        validateField,
        resetForm
    };
})();

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}
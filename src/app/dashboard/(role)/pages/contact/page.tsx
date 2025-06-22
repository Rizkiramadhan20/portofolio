import React from 'react'

import ContactLayout from '@/hooks/dashboard/pages/contact/ContactLayout'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact | Dashboard',
    description: 'Contact page',
}

export default function page() {
    return (
        <ContactLayout />
    )
}

# Learning Hub: Database Schema Documentation

This document explains the structure and purpose of the 22 tables that make up the PM/Mentor Learning Management System. 

The tables are grouped logically into distinct domains: User Management, Assessment & AI, Course Management, Mentorship, and Community/Marketing.

---

## 1. User & Identity Management
*   **`profiles`**: The central user record. When a user signs up via Supabase Auth (`auth.users`), a Postgres trigger automatically creates a row here. It stores their name, avatar, and their role (`learner`, `mentor`, or `admin`).
*   **`waitlist`**: A simple table to capture emails of users interested in the platform before they officially sign up.

---

## 2. Assessment & AI Core
This domain handles the initial evaluation of learners and stores the AI-generated insights mapping their skills to standard PM archetypes.

*   **`pm_archetypes`**: A static lookup table defining the different PM profiles (e.g., "Growth PM", "Technical PM", "0-to-1 PM").
*   **`archetype_results`**: Links a specific learner's `profile` to one or more `pm_archetypes` based on their assessment results.
*   **`assessments`**: Defines the different tests or questionnaires available on the platform to evaluate a learner's product skills.
*   **`assessment_questions`**: The multiple-choice or text questions that belong to a specific assessment. Contains a JSONB column to seamlessly store dynamic answering options without altering the table structure.
*   **`assessment_results`**: Records the final score and outcome a learner achieved on a completed assessment.
*   **`gap_analysis`**: Stores the highly-structured JSON output returned by Claude AI. It explicitly highlights where the learner's skills currently are versus where they need to be for their target archetype.
*   **`roadmaps`**: The personalized learning plan created exclusively for a user based on their `gap_analysis`.
*   **`roadmap_steps`**: The individual, actionable milestones within a roadmap (e.g., "Complete Product Metrics module"). Tracks status dynamically as `pending`, `in_progress`, or `completed`.

---

## 3. Course Management & Learning
These tables structure the educational content and track how learners move through it.

*   **`programs`**: The highest level curriculum or bootcamp (e.g., "The Full-Stack PM Course").
*   **`modules`**: Logical sections or chapters within a program (e.g., "Module 1: User Research"). Uses an `order_index` so everything displays sequentially.
*   **`lessons`**: The actual educational content (markdown text, embedded video links) belonging to a module.
*   **`enrollments`**: The ledger connecting a learner (`profile_id`) to a `program` when they sign up to take a specific course.
*   **`progress`**: The granular tracking table. It records whether a specific learner has completed, started, or not started a specific `lesson`. This computes their % completion across the board.

---

## 4. Mentorship
Handles the scheduling and tracking of 1-on-1 sessions between learners and expert PM mentors.

*   **`mentors`**: An extension of the `profiles` table tailored specifically for mentors. Stores their professional bio and an array of their expertise tags (e.g., "B2B SaaS", "Pricing Strategy", "Growth").
*   **`mentor_sessions`**: The booking record constraint table. Links a learner (`user_id`) with a `mentor_id` for a specific `start_time` and `end_time`. Tracks if the session is `scheduled`, `completed`, or `canceled`.

---

## 5. Marketing & Community
Tables for engaging users outside of the core curriculum and driving acquisition.

*   **`events`**: Public-facing webinars, Q&A sessions, or live cohort kick-offs including start times and URLs to join.
*   **`event_registrations`**: Tracks exactly which learners have RSVP'd to attend a specific event.
*   **`blog_posts`**: Content management table for articles written by admins or mentors that live on the public site for SEO and thought leadership.
*   **`testimonials`**: Social proof records linking back to the author (`profile_id`), to be displayed dynamically on the landing page or course checkout pages.
*   **`faqs`**: Frequently Asked Questions (Question & Answer pairs) for the public landing pages or support sections.

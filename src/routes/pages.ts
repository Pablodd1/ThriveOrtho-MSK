import { Hono } from 'hono';
import { loginPage, dashboardPage, jointsPage, intakePage, notesPage } from '../views/pages';

const pages = new Hono();

pages.get('/login', (c) => c.html(loginPage()));
pages.get('/doctor', (c) => c.html(dashboardPage()));
pages.get('/doctor/joints', (c) => c.html(jointsPage()));
pages.get('/doctor/intake', (c) => c.html(intakePage()));
pages.get('/doctor/notes', (c) => c.html(notesPage()));

// Redirects
pages.get('/doctor/video', (c) => c.redirect('/doctor'));
pages.get('/doctor/tasks', (c) => c.redirect('/doctor'));
pages.get('/doctor/patients', (c) => c.redirect('/doctor'));
pages.get('/patient', (c) => c.redirect('/login'));
pages.get('/patient/*', (c) => c.redirect('/login'));
pages.get('/coach', (c) => c.redirect('/login'));
pages.get('/coach/*', (c) => c.redirect('/login'));
pages.get('/admin', (c) => c.redirect('/login'));
pages.get('/admin/*', (c) => c.redirect('/login'));
pages.get('/', (c) => c.redirect('/login'));

export default pages;

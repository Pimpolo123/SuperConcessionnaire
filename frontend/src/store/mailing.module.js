import MailingService from '../services/mailing.service';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const mailing = {
    namespaced: true,
    state: initialState,
    actions: {
        sendemail({ commit }, email) {
            return MailingService.sendEmail(email).then(
                email => {
                    return Promise.resolve(email);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        setnewsletterinfos({ commit }, newsletterInfos) {
            return MailingService.setNewsletterInfos(newsletterInfos).then(
                newsletterInfos => {
                    return Promise.resolve(newsletterInfos);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        },
        getnewsletterinfos({ commit }) {
            return MailingService.getNewsletterInfos().then(
                newsletterInfos => {
                    return Promise.resolve(newsletterInfos);
                    },
                error => {
                    return Promise.reject(error);
                }
            );
        }
    }
};
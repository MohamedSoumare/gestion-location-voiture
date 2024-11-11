import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/authentificate/Login.vue';
import Register from '../components/authentificate/Register.vue';
import Dashboard from '../components/Dashboard.vue';
import UserList from '../components/users/UserList.vue';
import UserDetail from '../components/users/UserDetail.vue';
import UserAdd from '../components/users/UserAdd.vue';
import UserEdit from '../components/users/UserEdit.vue';
import ListCustomer from '../components/customers/ListCustomer.vue';
import AddCustomer from '../components/customers/AddCustomer.vue';
import DetailsCustomer from '../components/customers/DetailsCustomer.vue';
import ListVehicle from '../components/vehicles/ListVehicle.vue';
import AddVehicle from '../components/vehicles/AddVehicle.vue';
import EditVehicle from '../components/vehicles/EditVehicle.vue';
import DetailsVehicle from '../components/vehicles/DetailsVehicle.vue';
import ListContrat from '../components/contrats/ListContrat.vue';
import EditContrat from '../components/contrats/EditContrat.vue';
import DetailsContrat from '../components/contrats/DetailsContrat.vue';
import AddContrat from '../components/contrats/AddContrat.vue';
import ListReservation from '../components/reservations/ListReservation.vue';
import AddReservation from '../components/reservations/AddReservation.vue';
import EditReservation from '../components/reservations/EditReservation.vue';
import DetailsReservation from '../components/reservations/DetailsReservation.vue';
import EditCustomer from '../components/customers/EditCustomer.vue';



const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    children: [
    
      { path: '/users', name: 'UserList', component: UserList },
      { path: '/users/add', name: 'AddUser', component: UserAdd },
      { path: '/users/:id/edit', name: 'EditUser', component: UserEdit, props: true },
      { path: '/users/:id', name: 'UserDetail', component: UserDetail, props: true },
      { path: '/customer-list', name: 'CustomerList', component: ListCustomer },
      { path: '/customer/:id', name: 'CustomerDetails', component: DetailsCustomer, props: true },
      {path: '/customers/edit/:id?',name: 'CustomerEdit', component: EditCustomer,
        props: true
      },
      { path: '/customer-add', name: 'CustomerAdd', component: AddCustomer },

      {
        path: '/list-vehicle',
        name: 'ListVehicle',
        component: ListVehicle,
      },
      {
        path: '/vehicles/add',
        name: 'AddVehicle',
        component: AddVehicle,
      },
      {
        path: '/vehicles/edit/:id',
        name: 'EditVehicle',
        component: EditVehicle,
        props: true, 
      },
      {
        path: '/vehicles/:id',
        name: 'DetailsVehicle',
        component: DetailsVehicle,
        props: true, 
      },
      {
        path: '/reservations',
        name: 'ListReservation',
        component: ListReservation,
      },
      {
        path: '/reservation/add',
        name: 'AddReservation',
        component: AddReservation,
      },
      {
        path: '/reservation/edit/:id',
        name: 'EditReservation',
        component: EditReservation,
        props: true,
      },
      { path: '/reservations/details/:id', name: 'DetailsReservation', component: DetailsReservation },
      { path: '/contrats', name: 'ListContrat', component: ListContrat },
      { path: '/contrats/add', name: 'AddContrat', component: AddContrat},
      { path: '/contrats/edit/:id', name: 'EditContrat', component: EditContrat },
      { path: '/contrats/details/:id', name: 'DetailsContrat', component: DetailsContrat },
      ],
  },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

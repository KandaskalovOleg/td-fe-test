<script setup lang="ts">
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import { User } from '../types';
import { FormProps } from 'element-plus';
import { isValidAvatar, isValidEmail } from './../isValid';

const store = useStore();
const users = computed(() => store.state.response.data);

const removeUser = (id: number) => {
  store.commit('removeUser', id);
};

const userDialogVisible = ref(false);
const labelPosition = ref<FormProps['labelPosition']>('right');

const newUser = ref({
  id: 0,
  first_name: '',
  last_name: '',
  email: '',
  avatar: '',
});

const formValidation = ref({
  isValid: true,
  errors: {
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  },
});

const openUserDialog = () => {
  userDialogVisible.value = true;
};

const clearForm = () => {
  formValidation.value = {
    isValid: true,
    errors: {
      first_name: '',
      last_name: '',
      email: '',
      avatar: '',
    },
  };
};

const closeUserDialog = () => {
  userDialogVisible.value = false;
  clearForm();
};

const validateForm = () => {
  const errors = {
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  };

  if (!newUser.value.first_name) {
    errors.first_name = 'Please enter the first name';
  }

  if (!newUser.value.last_name) {
    errors.last_name = 'Please enter the last name';
  }

  if (!newUser.value.email) {
    errors.email = 'Please enter the email';
  } else if (!isValidEmail(newUser.value.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!newUser.value.avatar) {
    errors.avatar = 'Please enter the avatar link';
  } else if (!isValidAvatar(newUser.value.avatar)) {
    errors.avatar = 'Please enter a valid image URL (e.g., https://example.com/image.png)';
  }

  const isValid = Object.values(errors).every((fieldErrors) => fieldErrors.length === 0);

  formValidation.value = {
    isValid,
    errors,
  };

  return isValid;
};

const addUser = () => {
  if (!validateForm()) {
    return;
  }

  const maxId = Math.max(...store.state.response.data.map((user: User) => user.id));
  newUser.value.id = maxId + 1;

  store.commit('addUser', newUser.value);

  newUser.value = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  };

  userDialogVisible.value = false;
};

const perPage = ref(store.state.response.per_page);
const currentPage = ref(1);

const pageCount = computed(() => Math.ceil(users.value.length / perPage.value));

watch(users, () => {
  currentPage.value = 1;
});

const visibleUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return users.value.slice(start, end);
});

const goToPage = (page: any) => {
  currentPage.value = page;
};
</script>

<template>
  <div>
    <h1>Users Management</h1>
    <el-card class="card-wrapper">
      <div class="button-container">
        <el-button size="large" type="primary" @click="openUserDialog">Add user</el-button>
      </div>
      <el-table 
        :data="visibleUsers" 
        stripe border 
        v-if="visibleUsers.length > 0"
      >
        <el-table-column label="Avatar" width="70">
          <template #default="scope">
            <div class="avatar-container">
              <img :src="scope.row.avatar" alt="Avatar" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="First Name" min-width="120" prop="first_name" sortable></el-table-column>
        <el-table-column label="Last Name" min-width="120" prop="last_name" sortable></el-table-column>
        <el-table-column label="Email" min-width="180" prop="email" sortable></el-table-column>     
        <el-table-column label="Delete" width="100" fixed="right">
          <template #default="scope">
            <el-button type="danger" @click="removeUser(scope.row.id)">Delete</el-button>
          </template>
        </el-table-column>
        <el-table-column label="Edit" width="100" fixed="right">
          <template #default="scope">
            <router-link :to="{ name: 'UserDetails', params: { id: scope.row.id } }">
              <el-link type="default" :underline="false">Details</el-link>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="pagination-container">
      <el-pagination
        v-if="pageCount > 0"
        :current-page.sync="currentPage"
        :page-size="perPage"
        layout="prev, pager, next"
        :total="users.length"
        @current-change="goToPage"
      />
    </div>
    <el-dialog v-model="userDialogVisible" @closed="clearForm" title="Add new user">
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        style="width: 100%;"
      >
        <el-form-item label="First Name:" prop="newUser.first_name" :error="formValidation.errors.first_name">
          <el-input v-model="newUser.first_name" />
        </el-form-item>
        <el-form-item label="Last Name:" prop="newUser.last_name" :error="formValidation.errors.last_name">
          <el-input v-model="newUser.last_name" />
        </el-form-item>
        <el-form-item label="Email:" prop="newUser.email" :error="formValidation.errors.email">
          <el-input v-model="newUser.email" placeholder="enter valid email" />
        </el-form-item>
        <el-form-item label="Avatar:" prop="newUser.avatar" :error="formValidation.errors.avatar">
          <el-input v-model="newUser.avatar" placeholder="add link for image" />
        </el-form-item>
        <div class="button-container">
          <el-button @click="closeUserDialog">Cancel</el-button>
          <el-button type="primary" @click="addUser">Add User</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<style>
  .card-wrapper .el-card__body {
    padding: 0;
  }
  
  .pagination-container .el-pagination {
    display: flex;
    justify-content: center;
  }

  .avatar-container {
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 50%;
  }

  .avatar-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px auto;
  }

  .el-form .el-form-item {
      margin-bottom: 28px;
    }

  @media (max-width: 768px) {
    .el-form .el-form-item {
      margin-bottom: 36px;
    }

    .el-overlay-dialog .el-dialog {
      width: 80%;
    }
  }
</style>

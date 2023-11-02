<script setup lang="ts">
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { User } from '../types';
import { FormProps } from 'element-plus';
import { isValidEmail, isValidAvatar } from '../isValid';

const store = useStore();
const route = useRoute();

const userId = Array.isArray(route.params.id) ? parseInt(route.params.id[0], 10) : parseInt(route.params.id, 10);

const userDetails = computed(() => {
  return store.state.response.data.find((user: User) => user.id === userId);
});

const labelPosition = ref<FormProps['labelPosition']>('right');
const editDialogVisible = ref(false);

const editedUser = ref<User>({
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

const openEditDialog = () => {
  editedUser.value = { ...userDetails.value };
  editDialogVisible.value = true;
};

const closeEditDialog = () => {
  editDialogVisible.value = false;
  clearForm();
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

const validateForm = () => {
  const errors = {
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  };

  if (!editedUser.value.first_name) {
    errors.first_name = 'Please enter the first name';
  }

  if (!editedUser.value.last_name) {
    errors.last_name = 'Please enter the last name';
  }

  if (!editedUser.value.email) {
    errors.email = 'Please enter the email';
  } else if (!isValidEmail(editedUser.value.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!editedUser.value.avatar) {
    errors.avatar = 'Please enter the avatar link';
  } else if (!isValidAvatar(editedUser.value.avatar)) {
    errors.avatar = 'Please enter a valid image URL (e.g., https://example.com/image.png)';
  }

  const isValid = Object.values(errors).every((fieldErrors) => fieldErrors.length === 0);

  formValidation.value = {
    isValid,
    errors,
  };

  return isValid;
};

const saveUser = () => {
  if (!validateForm()) {
    return;
  }

  store.commit('updateUser', editedUser.value);

  closeEditDialog();
};
</script>

<template>
  <div>
    <h1>User Details</h1>
    <template v-if="userDetails">
      <div class="details-wrapper">
        <el-card class="user-details-card" style="max-width: 800px;">
          <div class="button-container">
            <el-button type="primary" @click="openEditDialog">Edit</el-button>
          </div>
          <el-row justify="center">
            <el-col span="12" md="6" style="margin-right: 20px; margin-bottom: 20px;">
              <el-image :src="userDetails.avatar" alt="Avatar" />
            </el-col>
            <el-col span="12" md="12">
              <el-descriptions column="1">
                <el-descriptions-item label="First Name:">{{ userDetails.first_name }}</el-descriptions-item>
                <el-descriptions-item label="Last Name:">{{ userDetails.last_name }}</el-descriptions-item>
                <el-descriptions-item label="Email:">{{ userDetails.email }}</el-descriptions-item>
              </el-descriptions>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </template>
    <template v-else>
      <p>No such user exists</p>
    </template>

    <el-dialog v-model="editDialogVisible" @closed="clearForm" title="Edit User">
      <el-form :label-position="labelPosition" label-width="100px" style="width: 100%;">
        <el-form-item label="First Name:" prop="editedUser.first_name" :error="formValidation.errors.first_name">
          <el-input v-model="editedUser.first_name" />
        </el-form-item>
        <el-form-item label="Last Name:" prop="editedUser.last_name" :error="formValidation.errors.last_name">
          <el-input v-model="editedUser.last_name" />
        </el-form-item>
        <el-form-item label="Email:" prop="editedUser.email" :error="formValidation.errors.email">
          <el-input v-model="editedUser.email" placeholder="enter valid email" />
        </el-form-item>
        <el-form-item label="Avatar:" prop="editedUser.avatar" :error="formValidation.errors.avatar">
          <el-input v-model="editedUser.avatar" placeholder="add link for image" />
        </el-form-item>
        <div class="button-container">
          <el-button @click="closeEditDialog">Cancel</el-button>
          <el-button type="primary" @click="saveUser">Save</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>


<style scoped>
  .button-container {
    display: flex;
    justify-content: flex-end;
  }

  .details-wrapper {
    display: flex;
    justify-content: center;
  }
</style>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { type Student } from "@/type";
import StudentService from "@/services/StudentService";
import { type Teacher } from "@/type";
import { useCommentsStore } from "@/stores/comment";
import TeacherService from "@/services/TeacherService";

const commentsStore = useCommentsStore();

const props = defineProps({
  studentId: String,

});

const student = ref<Student | null>(null);
const teacher = ref<Teacher | null>(null);
const editedStudent = ref<Student | null>(null); // 新增
const isEditing = ref(false); // 新增

const comments = computed(() => {
  if (student.value) {
    return commentsStore.getComments(student.value.studentId);
  }
  return [];
});
const commentsCount = computed(() => {
  if (student.value) {
    return commentsStore.getCommentsCount(student.value.studentId);
  }
  return 0;
});
const newComment = ref("");
const flashMessage = ref(false); // Controls the visibility of the flash message

onMounted(async () => {
  if (props.studentId) {
    const studentResponse = await StudentService.getStudentById(props.studentId);
    student.value = studentResponse.data as Student;

    // Assuming the advisor object is populated with the teacher data
    if (student.value.advisor?.id) {
      const teacherId = student.value.advisor.id.toString();
      const teacherResponse = await StudentService.getTeacherByTeacherID(teacherId);
      teacher.value = teacherResponse.data as Teacher;
    }
  }
});



function submitComment() {
  if (newComment.value.trim() !== "" && student.value) { // 检查 student.value 是否存在
    commentsStore.addComment(student.value.studentId, newComment.value);
    newComment.value = "";
    flashMessage.value = true; // Show flash message
    setTimeout(() => (flashMessage.value = false), 1000); // Hide flash message after 3 seconds
  }
}

// 修改链式调用中的数据处理
StudentService.getStudentById(String(props.studentId))
  .then((studentResponse) => {
    // 直接将数据赋值给student.value，而不是将其视为数组
    student.value = studentResponse.data as Student;
    // 根据student.value.advisor.id获取教师信息
    return StudentService.getTeacherByTeacherID(student.value?.advisor.id.toString());
  })
  .then((teacherResponse) => {
    // 正确地将教师信息赋值给teacher.value
    teacher.value = teacherResponse.data as Teacher;
  })
  .catch((error) => {
    console.error(error);  // 添加错误处理，将错误打印到控制台
  });

function editStudent() {
  editedStudent.value = { ...(student.value as Student) };
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
}


async function saveChanges() {
  if (editedStudent.value && editedStudent.value.id) {
    const { data } = await StudentService.updateStudent(editedStudent.value.id.toString(), editedStudent.value);
    student.value = data;
    isEditing.value = false;
  }
}
const searchedTeacherName = ref(""); // 存放搜索框里的老师名字

async function searchTeacher() {
  if (searchedTeacherName.value) {
    const response = await TeacherService.searchTeachersByName(searchedTeacherName.value);
    if (response.data) {
      teacher.value = response.data as Teacher;
    }
  }
}

async function setRelation() {
  if (student.value && teacher.value) {
    const response = await StudentService.setRelation(student.value.studentId, teacher.value.firstname);
    if (response.data) {
      student.value = response.data as Student;
    }
  }
}
</script>

<template>
  <main class="container mx-auto w-screen flex">

    <!-- Student&Teacher Info -->

    <div v-if="student" class="space-y-4 mt-3">
      <h1 class="text-2xl font-bold">Student Information:</h1>

      <div
        class="p-5 w-96 h-auto rounded-lg bg-gradient-to-b from-[rgb(242,243,244)] m-4 shadow-xl ring-1 ring-gray-900/5">
        <!-- Student Details -->
        <img class="w-full h-56 object-cover" :src="student.images[0]" />
        <div class="flex items-center space-x-4 mb-4">

          <div v-if="isEditing">
            <h2 class="text-2xl font-bold mb-2">Firstname</h2>
            <input v-model="editedStudent.firstname" placeholder="Firstname">
            <h2 class="text-2xl font-bold mb-2">Surname</h2>
            <input v-model="editedStudent.surname" placeholder="Surname">
            <button @click="cancelEdit"
              class="bg-white text-gray-800 font-bold rounded border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
              <span class="mr-2">Cancel</span>
              <!-- SVG 省略 -->
            </button>

            <!-- 第二个按钮 -->
            <button @click="saveChanges"
              class="bg-white text-gray-800 font-bold rounded border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
              <span class="mr-2">Save</span>
              <!-- SVG 省略 -->
            </button>
            <!-- ... 其他信息也可以像上面这样进行编辑 -->
          </div>
          <div v-else>
            <h2 class="text-2xl font-bold mb-2">Firstname</h2>
            <h2 class="text-2xl mb-2">{{ student.firstname }}</h2>
            <h2 class="text-2xl font-bold mb-2">Surname</h2>
            <h2 class="text-2xl mb-2">{{ student.surname }}</h2>
            <!-- ... 其他信息的展示 -->
          </div>

          <div>
            <!-- <h2 class="text-2xl font-bold mb-2">Firstname</h2>
            <h2 class="text-2xl mb-2">
              {{ student.firstname }}
            </h2>
            <h2 class="text-2xl font-bold mb-2">Surname</h2>
            <h2 class="text-2xl mb-2">
              {{ student.surname }}
            </h2> -->
            <h2 class="text-2xl font-bold mb-2">StudentId:</h2>
            <h2 class="text-2xl mb-2">{{ student.studentId }}</h2>
            <h2 class="text-2xl font-bold mb-2">Department:</h2>
            <h2 class="text-2xl mb-2">{{ student.department }}</h2>
          </div>

        </div>
        <div class="flex justify-between">
          <!-- 第一个按钮 -->
          <button @click="editStudent"
            class="bg-white text-gray-800 font-bold rounded border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span class="mr-2">Edit</span>
            <!-- SVG 省略 -->
          </button>


        </div>

        <!-- 新增的编辑按钮 -->
        <!-- 新增的保存按钮 -->
      </div>
    </div>
    <!-- Teacher Details -->

    <div class="w-1/2 p-4 mt-3">
      <!-- Comments Section -->
      <h1 class="text-2xl font-bold">Advisor Given comment:</h1>
      <div class="border-t border-gray-300 p-4 space-y-4 h-auto overflow-y-auto w-auto">
        <h2>All Comments [total: {{ commentsCount }} comment now]</h2>
        <div v-for="(comment, index) in comments" :key="index">
          <p>{{ comment }}</p>
        </div>
        <!-- Add Comment -->
        <div class="border-t border-gray-300 pt-4">
          <h2>Add Comment</h2>
          <div class="comment-box mt-4">
            <textarea v-model="newComment" placeholder="Write a comment"
              class="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-500"></textarea>
            <button @click="submitComment"
              class="mb-3 bg-white text-gray-800 font-bold rounded border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
              <span class="mr-2">Submit</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentcolor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>

            <div v-if="flashMessage"
              class="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              role="alert">
              <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span class="sr-only">Info</span>
              <div>
                <span class="font-medium">Success! </span> You successfully uploaded a comment.
              </div>
            </div>

          </div>
        </div>
      </div>

      <div>
        <input v-model="searchedTeacherName" placeholder="Seacher Advisor first name">
        <button @click="searchTeacher">Search</button>

        <p v-if="teacher">Searched Advisor: {{ teacher.firstname }}</p>
        <p v-if="student">Current Student: {{ student.firstname }}</p>
        <button @click="setRelation">Set Relation</button>
      </div>
      <div class="space-y-4">
        <h1 class="text-2xl font-bold mb-1">Advisor:</h1>
        <div
          class="p-5 w-100 h-40 flex items-center rounded-lg bg-gradient-to-b from-[rgb(242,243,244)] m-4 shadow-xl ring-1 ring-gray-900/5">
          <img class="w-24 h-24 object-cover rounded-md shadow-lg " :src="teacher?.images[0]" />
          <div class="ml-4">
            <h1 class="mb-2 text-2xl font-bold">Name: {{ teacher?.firstname }} {{ teacher?.surname }}</h1>
            <h1 class="mb-3 text-lg">Advisor ID: <span
                class=" mb-3 rounded-lg italic font-bold bg-[rgb(158,118,180)] py-1 px-2 text-xl text-white">{{
                  teacher?.teacherId }}</span></h1>
            <RouterLink :to="{
              name: 'teacher-detail',
              params: { teacherId: teacher?.teacherId },
            }">
              <button
                class="bg-white text-gray-800 font-bold rounded border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
                <span class="mr-2"> Teacher Detail</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path fill-rule="evenodd"
                    d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 001.28.53l4.184-4.183a.39.39 0 01.266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0012 2.25zM8.25 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zm2.625 1.125a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                    clip-rule="evenodd" />
                </svg>

              </button>
            </RouterLink>

          </div>

        </div>
      </div>

    </div>



    <a href="/"
      class="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-[rgb(29,161,242)] transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-100 group shadow-xl">
      <span
        class="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[rgb(29,161,242)] group-hover:h-full"></span>
      <span class="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </span>
      <span class="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </span>
      <span
        class="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white font-bold text-2xl">Back
        to


        Mainpage</span>
    </a>


  </main>
</template>





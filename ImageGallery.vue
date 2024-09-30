<template>
    <div class="gallery-container">
      <div class="gallery-grid">
        <!-- Display images -->
        <div v-for="(image, index) in images" :key="index" class="gallery-item" @click="openImage(image)">
          <img :src="image.url" :alt="image.title" />
        </div>
      </div>
  
      <!-- Modal to display the enlarged image -->
      <div v-if="selectedImage" class="image-modal" @click.self="closeImage">
        <span class="close-btn" @click="closeImage">&times;</span>
        <img :src="selectedImage.url" :alt="selectedImage.title" class="modal-content" />
        <div class="image-caption">{{ selectedImage.title }}</div>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    name: 'ImageGallery',
    data() {
      return {
        images: [
          { title: 'Image 1', url: 'https://astrovibz.com/wp-content/uploads/2022/06/Lord-Muruga-Homam.png' },
          { title: 'Image 2', url: 'https://nepalyogahome.com/wp-content/uploads/2021/04/lord-shiva-the-founder-of-yoga.jpg' },
          { title: 'Image 3', url: 'https://thewildlife.blog/wp-content/uploads/2023/06/img_6078-1024x768.jpg' },
          { title: 'Image 4', url: 'data:image/png;base64,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' },
          { title: 'Image 5', url: 'https://images.pexels.com/photos/312839/pexels-photo-312839.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        ],
        searchQuery: '',
        selectedImage: null,
      };
    },
    computed: {
      filteredImages() {
        return this.images.filter(image => 
          image.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
    },
    methods: {
      openImage(image) {
        this.selectedImage = image;
      },
      closeImage() {
        this.selectedImage = null;
      },
    },
  };
  </script>
  
  <style scoped>
  .gallery-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin: 20px 0;
  }
  
  .gallery-item img {
    width: 100%;
    height: auto;
    cursor: pointer;
    border: 2px solid #ddd;
    border-radius: 5px;
    transition: transform 0.3s;
  }
  
  .gallery-item img:hover {
    transform: scale(1.05);
  }
  
  /* Modal styling */
  .image-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
  }
  
  .modal-content {
    max-width: 80%;
    max-height: 80%;
  }
  
  .image-caption {
    color: #fff;
    text-align: center;
    margin-top: 15px;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 25px;
    font-size: 40px;
    color: #fff;
    cursor: pointer;
  }
  </style>

<template>
    <div class="gallery-container">
      <!-- Search input -->
      <input v-model="searchQuery" type="text" placeholder="Search images..." class="search-bar" />
  
      <div class="gallery-grid">
        <!-- Display images -->
        <div v-for="(image, index) in filteredImages" :key="index" class="gallery-item" @click="openImage(image)">
          <img :src="image.url" :alt="image.title" />
        </div>
      </div>
  
      <!-- Modal to display the enlarged image -->
      <div v-if="selectedImage" class="image-modal" @click.self="closeImage">
        <span class="close-btn" @click="closeImage">&times;</span>
        <img :src="selectedImage.url" :alt="selectedImage.title" class="modal-content" />
        <div class="image-caption">{{ selectedImage.title }}</div>
      </div>
    </div>
  </template>

<style scoped>
/* Add these styles to the existing style block */
.search-bar {
  margin: 20px 0;
  padding: 10px;
  width: 50%;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>

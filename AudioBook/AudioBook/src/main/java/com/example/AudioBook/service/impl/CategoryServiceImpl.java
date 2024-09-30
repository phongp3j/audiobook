package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.Category.CategoryRequest;
import com.example.AudioBook.DTO.Category.CategoryResponseDTO;
import com.example.AudioBook.entity.Category;
import com.example.AudioBook.repository.CategoryRepository;
import com.example.AudioBook.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


@Repository
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Override
    public List<CategoryResponseDTO> getAll() {
        List<CategoryResponseDTO> res = new ArrayList<>();
        List<Category> tmp = categoryRepository.findAll();
        for(int i = 0 ; i < tmp.size() ; i++){
            Category x = tmp.get(i);
            CategoryResponseDTO y = new CategoryResponseDTO();
            y.setId(x.getId());
            y.setName(x.getCategory_name());
            y.setBooks(Long.valueOf(2));
            res.add(y);
        }
        return res;
    }

    @Override
    public String addCategory(CategoryRequest categoryRequest) {
        Category x = new Category();
        x.setCategory_name(categoryRequest.getName());
        List<Category> list = categoryRepository.findAll();
        for(Category i : list){
            if(i.getCategory_name().toLowerCase().equals(categoryRequest.getName().toLowerCase())){
                return "Failed!";
            }
        }
        categoryRepository.save(x);
        return "Success!";
    }

    @Override
    public String updateCategory(Long id, CategoryRequest categoryRequest) {
        Category category = categoryRepository.findById(id).get();
        category.setCategory_name(categoryRequest.getName());
        categoryRepository.save(category);
        return "Success!";
    }
}

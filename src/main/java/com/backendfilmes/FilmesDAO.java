package com.backendfilmes;

import org.springframework.data.jpa.repository.JpaRepository;



public interface  FilmesDAO  extends JpaRepository<Filmes, Integer> {

}

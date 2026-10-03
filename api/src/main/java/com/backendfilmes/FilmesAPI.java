package com.backendfilmes;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;




@RestController
@RequestMapping("filmes")
@CrossOrigin("*")

public class FilmesAPI {
	
	
	@Autowired
	private FilmesDAO dao;
	
	@GetMapping
	public List<Filmes> obterTodos() {
		return dao.findAll();
	}

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping
	public Filmes inserir(@RequestBody Filmes f) {
		dao.save(f);
		return f;
	}
	@PutMapping("{id}")
	 public Filmes update(@PathVariable int id, @RequestBody Filmes f) {
        dao.findById(id);
        f.id = id;
		dao.save(f);
        return f;
    }
//	@ResponseStatus(HttpStatus.NO_CONTENT)
	@DeleteMapping("{id}")
    public String delete(@PathVariable int id) {
		dao.deleteById(id);
        return "Filmes id =" + id + " deletado com sucesso!";
    }	

//	@ResponseStatus(HttpStatus.NO_CONTENT)
	@DeleteMapping
	public String deleteAll() {
		dao.deleteAll();
		return "você apagou tudo";
	}
	
	
}
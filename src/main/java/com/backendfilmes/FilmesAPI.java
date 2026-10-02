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
import org.springframework.web.bind.annotation.RestController;




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

	@PostMapping
	public Filmes inserir(@RequestBody Filmes l) {
		dao.save(l);
		return l;
	}
	@PutMapping("{id}")
	 public Filmes update(@PathVariable int id, @RequestBody Filmes f) {
        dao.findById(id);
        f.id = id;
		dao.save(f);
        return f;
    }
	
	@DeleteMapping("{id}")
    public String delete(@PathVariable int id) {
		dao.deleteById(id);
        return "Fimes id =" + id + " deleted successfully!";
    }
	@DeleteMapping
	public String deleteAll() {
		dao.deleteAll();
		return "você apagou tudo";
	}
	
	
}
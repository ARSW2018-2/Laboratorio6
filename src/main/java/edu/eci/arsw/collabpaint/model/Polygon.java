/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.collabpaint.model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author cesar
 */
public class Polygon {
    
    List<Point> points;
    
    Polygon(){
        points=new ArrayList<Point>();
    
    }
    public void addPoint(Point p){
        points.add(p);
    }
    
    public List<Point> getPoints() {
        return points;
    }
     public void setPoints(List<Point> points) {
        this.points = points;
    }
     @Override
    public String toString() {
        return "Polygon{" + "points=" + points + '}';
    }
    
}

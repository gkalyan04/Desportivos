package com.example.jaspreet.sportsfest.Interfaces;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface ApiInterface_createINTQ {
    @GET("createINT/{p1}/{p2}/{p3}/{p4}/{p5}")
    Call<ResponseBody> getall(
            @Path("p1") String qid,
            @Path("p2") String content,
            @Path("p3") String rate,
            @Path("p4") String pub,
            @Path("p5") String pri

    );
}
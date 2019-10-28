package com.example.jaspreet.sportsfest.Interfaces;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface ApiInterface_getSPTbal {
    @GET("getbalance/{p1}")
    Call<ResponseBody> getall(
            @Path("p1") String pub
    );
}


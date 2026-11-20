export const MAIN_ACTIVITY_KOTLIN = `package com.ejemplo.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp

enum class Prioridad(val etiqueta: String, val color: Color) {
    BAJA("Baja", Color(0xFF047857)),
    MEDIA("Media", Color(0xFFB45309)),
    ALTA("Alta", Color(0xFFB91C1C))
}

data class Actividad(
    val id: Int,
    val titulo: String,
    val fecha: String = "",
    val prioridad: Prioridad = Prioridad.MEDIA,
    val completada: Boolean = false
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MiAgendaScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaScreen() {
    var textoActividad by remember { mutableStateOf("") }
    var fechaActividad by remember { mutableStateOf("") }
    var prioridadActividad by remember { mutableStateOf(Prioridad.MEDIA) }
    var mensajeError by remember { mutableStateOf("") }
    var textoBusqueda by remember { mutableStateOf("") }
    var siguienteId by remember { mutableIntStateOf(1) }
    val actividades = remember { mutableStateListOf<Actividad>() }
    var actividadEnEdicion by remember { mutableStateOf<Actividad?>(null) }

    val actividadesFiltradas = if (textoBusqueda.isBlank()) {
        actividades
    } else {
        actividades.filter {
            it.titulo.contains(textoBusqueda.trim(), ignoreCase = true)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Mi Agenda") })
        }
    ) { paddingInterno ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingInterno)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedTextField(
                value = textoActividad,
                onValueChange = {
                    textoActividad = it
                    mensajeError = if (it.isNotEmpty() && it.isBlank()) "Debes escribir una actividad." else ""
                },
                label = { Text("Escribe una actividad") },
                isError = mensajeError.isNotEmpty(),
                supportingText = if (mensajeError.isNotEmpty()) { { Text(mensajeError) } } else null,
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = fechaActividad,
                onValueChange = { fechaActividad = it },
                label = { Text("Fecha (ej. 25/11/2026)") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            SelectorPrioridad(
                seleccionada = prioridadActividad,
                onSeleccionar = { prioridadActividad = it }
            )

            Button(
                onClick = {
                    val tituloLimpio = textoActividad.trim()
                    if (tituloLimpio.isEmpty()) {
                        mensajeError = "Debes escribir una actividad."
                    } else {
                        actividades.add(
                            Actividad(
                                id = siguienteId,
                                titulo = tituloLimpio,
                                fecha = fechaActividad.trim().ifEmpty { "Hoy" },
                                prioridad = prioridadActividad
                            )
                        )
                        siguienteId++
                        textoActividad = ""
                        fechaActividad = ""
                        prioridadActividad = Prioridad.MEDIA
                        mensajeError = ""
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
            ) {
                Text("Agregar actividad")
            }

            ResumenProgresoCard(
                total = actividades.size,
                completadas = actividades.count { it.completada }
            )

            OutlinedTextField(
                value = textoBusqueda,
                onValueChange = { textoBusqueda = it },
                label = { Text("Buscar actividad por nombre") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Buscar") },
                trailingIcon = {
                    if (textoBusqueda.isNotEmpty()) {
                        IconButton(onClick = { textoBusqueda = "" }) {
                            Icon(Icons.Default.Close, contentDescription = "Limpiar búsqueda")
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            if (actividadesFiltradas.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxWidth().weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (actividades.isEmpty()) {
                            "No hay actividades todavía. Escribe una arriba para empezar."
                        } else {
                            "No se encontraron actividades con ese nombre."
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth().weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(actividadesFiltradas, key = { it.id }) { actividad ->
                        ActividadItem(
                            actividad = actividad,
                            onToggleCompletada = {
                                val index = actividades.indexOfFirst { it.id == actividad.id }
                                if (index != -1) {
                                    actividades[index] = actividad.copy(completada = !actividad.completada)
                                }
                            },
                            onEditar = { actividadEnEdicion = actividad },
                            onEliminar = { actividades.removeAll { it.id == actividad.id } }
                        )
                    }
                }
            }
        }

        actividadEnEdicion?.let { actividad ->
            EditarActividadDialog(
                actividad = actividad,
                onGuardar = { nuevoTitulo, nuevaFecha, nuevaPrioridad ->
                    val index = actividades.indexOfFirst { it.id == actividad.id }
                    if (index != -1) {
                        actividades[index] = actividad.copy(
                            titulo = nuevoTitulo,
                            fecha = nuevaFecha.ifEmpty { "Hoy" },
                            prioridad = nuevaPrioridad
                        )
                    }
                    actividadEnEdicion = null
                },
                onCancelar = { actividadEnEdicion = null }
            )
        }
    }
}

@Composable
fun SelectorPrioridad(seleccionada: Prioridad, onSeleccionar: (Prioridad) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(text = "Prioridad", style = MaterialTheme.typography.labelLarge)
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Prioridad.entries.forEach { prioridad ->
                if (prioridad == seleccionada) {
                    Button(
                        onClick = { onSeleccionar(prioridad) },
                        colors = ButtonDefaults.buttonColors(containerColor = prioridad.color),
                        modifier = Modifier.weight(1f)
                    ) { Text(prioridad.etiqueta) }
                } else {
                    OutlinedButton(
                        onClick = { onSeleccionar(prioridad) },
                        modifier = Modifier.weight(1f)
                    ) { Text(prioridad.etiqueta) }
                }
            }
        }
    }
}

@Composable
fun ResumenProgresoCard(total: Int, completadas: Int) {
    val progreso = if (total == 0) 0f else completadas.toFloat() / total
    val porcentaje = (progreso * 100).toInt()
    OutlinedCard(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.fillMaxWidth().padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Progreso: \$completadas de \$total completadas", style = MaterialTheme.typography.bodyMedium)
                Text("\$porcentaje%", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.primary)
            }
            LinearProgressIndicator(progress = { progreso }, modifier = Modifier.fillMaxWidth().height(8.dp))
        }
    }
}

@Composable
fun ActividadItem(
    actividad: Actividad,
    onToggleCompletada: () -> Unit,
    onEditar: () -> Unit,
    onEliminar: () -> Unit
) {
    OutlinedCard(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(checked = actividad.completada, onCheckedChange = { onToggleCompletada() })
            Column(modifier = Modifier.weight(1f).padding(horizontal = 8.dp)) {
                Text(
                    text = "\${actividad.titulo} · \${actividad.fecha.ifBlank { "Hoy" }}",
                    style = MaterialTheme.typography.bodyLarge,
                    textDecoration = if (actividad.completada) TextDecoration.LineThrough else TextDecoration.None
                )
                Text(
                    text = "Prioridad \${actividad.prioridad.etiqueta}",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = actividad.prioridad.color
                )
            }
            IconButton(onClick = onEditar) {
                Icon(Icons.Default.Edit, contentDescription = "Editar actividad", tint = MaterialTheme.colorScheme.primary)
            }
            IconButton(onClick = onEliminar) {
                Icon(Icons.Default.Delete, contentDescription = "Eliminar actividad", tint = MaterialTheme.colorScheme.error)
            }
        }
    }
}

@Composable
fun EditarActividadDialog(
    actividad: Actividad,
    onGuardar: (String, String, Prioridad) -> Unit,
    onCancelar: () -> Unit
) {
    var nuevoTitulo by remember(actividad.id) { mutableStateOf(actividad.titulo) }
    var nuevaFecha by remember(actividad.id) { mutableStateOf(actividad.fecha) }
    var nuevaPrioridad by remember(actividad.id) { mutableStateOf(actividad.prioridad) }

    AlertDialog(
        onDismissRequest = onCancelar,
        title = { Text("Editar actividad") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = nuevoTitulo,
                    onValueChange = { nuevoTitulo = it },
                    label = { Text("Nombre de la actividad") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = nuevaFecha,
                    onValueChange = { nuevaFecha = it },
                    label = { Text("Fecha (ej. 25/11/2026)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                SelectorPrioridad(seleccionada = nuevaPrioridad, onSeleccionar = { nuevaPrioridad = it })
            }
        },
        confirmButton = {
            Button(onClick = {
                val tituloLimpio = nuevoTitulo.trim()
                if (tituloLimpio.isNotEmpty()) onGuardar(tituloLimpio, nuevaFecha.trim(), nuevaPrioridad)
            }) { Text("Guardar") }
        },
        dismissButton = { TextButton(onClick = onCancelar) { Text("Cancelar") } }
    )
}`;
